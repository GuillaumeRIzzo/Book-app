import { useEffect, useState } from 'react';
import styled from 'twin.macro';
import { addUser } from '@/api/userApi';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import useEmailValidator from '@/hooks/useEmailValidator';
import useLoginValidator from '@/hooks/useLoginValidator';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';
import { encryptPayload } from '@/utils/encryptUtils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllGenders } from '../genders/genderSelector';
import { useRouter } from 'next/router';

const FormWrapper = styled.div`
  w-full md:w-2/4 p-6 
`;

const UserForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'form', 'errors']);
  
  const router = useRouter();

  const genders = useSelector(selectAllGenders); // Assure-toi que cette donnée est bien présente dans le store

  const [formData, setFormData] = useState({
    userFirstname: '',
    userLastname: '',
    userPassword: '',
    userLogin: '',
    userEmail: '',
    userBirthDate: '',
    confirmPassword: '',
    genderUuid: '',
    userRightUuid: '',
  });

  const [touched, setTouched] = useState({
    userFirstname: false,
    userLastname: false,
    userPassword: false,
    userLogin: false,
    userEmail: false,
    confirmPassword: false,
  });

  const emailError = useEmailValidator(formData.userEmail);
  const loginError = useLoginValidator(formData.userLogin);
  const passwordErrors = usePasswordValidator(formData.userPassword);
  const confirmPasswordError = useConfirmPasswordValidator(
    formData.userPassword,
    formData.confirmPassword,
  );

  const [apiErrors, setApiErrors] = useState({
    Email: '',
    Login: '',
    Password: '',
  });

  useEffect(() => {
    setApiErrors({ Email: '', Login: '', Password: '' });
  }, [formData.userLogin, formData.userEmail, formData.userPassword]);

  const formValidator =
    !emailError &&
    !loginError &&
    Object.values(passwordErrors).length < 1 &&
    !confirmPasswordError;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formValidator) {
        const encryptedPayload = encryptPayload({
          UserFirstname: formData.userFirstname,
          UserLastname: formData.userLastname,
          UserPassword: formData.userPassword,
          UserLogin: formData.userLogin,
          UserEmail: formData.userEmail,
          UserBirthDate: formData.userBirthDate || null,
          GenderUuid: formData.genderUuid || null,
          UserRightUuid: formData.userRightUuid,
        });

        await addUser(encryptedPayload);
        router.push('/validate-email-sent');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { name, message } = error.response.data as { name: string; message: string };
        setApiErrors(prevErrors => ({
          ...prevErrors,
          [name]: message,
        }));
      } else {
        console.error('Unexpected error', error);
      }
    }
  };

  return (
    <FormWrapper>
      <h2 className='text-2xl mb-6 text-center font-semibold'>{t('auth:signupTitle')}</h2>

      <Input
        label={t('form:firstname')}
        type='text'
        name='userFirstname'
        value={formData.userFirstname}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        error={touched.userFirstname && !formData.userFirstname}
        infoText={touched.userFirstname && !formData.userFirstname ? t('errors:firstnameRequired') : ''}
        autoFocus
        required
      />

      <Input
        label={t('form:lastname')}
        name='userLastname'
        value={formData.userLastname}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        error={touched.userLastname && !formData.userLastname}
        infoText={touched.userLastname && !formData.userLastname ? t('errors:lastnameRequired') : ''}
        required
      />

      <Input
        label={t('form:login')}
        name='userLogin'
        value={formData.userLogin}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        error={touched.userLogin && (loginError || apiErrors.Login) ? true : undefined}
        helperText={touched.userLogin ? loginError || apiErrors.Login : ''}
        required
      />

      <Input
        label={t('form:email')}
        type='email'
        name='userEmail'
        value={formData.userEmail}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        error={touched.userEmail && (emailError || apiErrors.Email) ? true : undefined}
        helperText={touched.userEmail ? emailError || apiErrors.Email : ''}
        required
      />

      <Input
        label={t('form:password')}
        type='password'
        name='userPassword'
        value={formData.userPassword}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        required
      />

      <div className='text-base space-y-1'>
        <p className={passwordErrors.missingUppercase ? 'text-red-500' : 'text-green-500'}>
          {t('errors:uppercaseMissing')}
        </p>
        <p className={passwordErrors.missingLowercase ? 'text-red-500' : 'text-green-500'}>
          {t('errors:lowercaseMissing')}
        </p>
        <p className={passwordErrors.missingNumber ? 'text-red-500' : 'text-green-500'}>
          {t('errors:numberMissing')}
        </p>
        <p className={passwordErrors.missingSpecialChar ? 'text-red-500' : 'text-green-500'}>
          {t('errors:specialCharMissing')}
        </p>
        <p className={passwordErrors.minLength ? 'text-red-500' : 'text-green-500'}>
          {t('errors:minLength')}
        </p>
      </div>

      <Input
        label={t('form:confirmPassword')}
        type='password'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChangeInput}
        onBlur={handleBlur}
        error={touched.confirmPassword && confirmPasswordError && formData.confirmPassword.length > 0 ? true : undefined}
        infoText={touched.confirmPassword && confirmPasswordError ? t('errors:passwordsNotMatching') : ''}
        required
      />

      <div className='my-3'>
        <label className='block text-sm font-medium'>{t('form:birthdate', 'Date de naissance')}</label>
        <input
          type='date'
          name='userBirthDate'
          value={formData.userBirthDate}
          onChange={handleChangeInput}
          className='mt-1 block w-full border rounded p-2'
        />
      </div>

      <div className='my-3'>
        <label className='block text-sm font-medium'>{t('form:gender', 'Genre')}</label>
        <select
          name='genderUuid'
          value={formData.genderUuid}
          onChange={handleChangeSelect}
          className='mt-1 block w-full border rounded p-2'
        >
          <option value=''>{t('form:selectGender', 'Sélectionner un genre')}</option>
          {genders?.map(g => (
            <option key={g.genderUuid} value={g.genderUuid}>
              {g.genderLabel}
            </option>
          ))}
        </select>
      </div>

      <CustomButton
        text={t('form:submit')}
        onClick={handleSubmit}
        disable={!formValidator}
      />
    </FormWrapper>
  );
};

export default UserForm;
import { useEffect, useState } from 'react';
import styled from 'twin.macro';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import useEmailValidator from '@/hooks/useEmailValidator';
import useLoginValidator from '@/hooks/useLoginValidator';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';
<<<<<<< HEAD
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';
import axios from 'axios';
=======
import { encryptPayload } from '@/utils/encryptUtils';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllGenders } from '../genders/genderSelector';
import { useRouter } from 'next/router';
import { AppDispatch } from '@/redux/store';
import { createUser } from './UserSlice';
import axios from 'axios';
import { BirthDatePicker } from '@/components/common/DatePicker';
>>>>>>> f571f8d (chore: save current work before project cleanup)

const FormWrapper = styled.div`
  w-2/4
  p-6 
`;

<<<<<<< HEAD
interface FormProps {
  title: string;
}
=======
const UserForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'form', 'errors', 'validation']);
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const genders = useSelector(selectAllGenders);
>>>>>>> f571f8d (chore: save current work before project cleanup)

const UserForm: React.FC<FormProps> = ({ title }) => {
  const [formData, setFormData] = useState({
    userId: 0,
    userFirstname: '',
    userLastname: '',
    userPassword: '',
    userLogin: '',
    userEmail: '',
<<<<<<< HEAD
    userRight: 'User',
    confirmPassword: '',
=======
    userBirthDate: null as Date | null,
    confirmPassword: '',
    genderUuid: '',
>>>>>>> f571f8d (chore: save current work before project cleanup)
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

  const formValidator: boolean =
    !emailError && !loginError && Object.values(passwordErrors).length < 1 && !confirmPasswordError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = () => {
    try {
<<<<<<< HEAD
      if (formValidator) {
        const encryptedPayload: EncryptedPayload = encryptPayload({
          UserFirstname: formData.userFirstname,
          UserLastname: formData.userLastname,
          UserPassword: formData.userPassword,
          UserLogin: formData.userLogin,
          UserEmail: formData.userEmail,
          UserRight: formData.userRight,
        });

        await addUser(encryptedPayload);
      } else {
        console.error('Validation failed');
      }
=======
      if (!formValidator) return;

      const encryptedPayload = encryptPayload({
        UserFirstname: formData.userFirstname,
        UserLastname: formData.userLastname,
        UserPassword: formData.userPassword,
        UserLogin: formData.userLogin,
        UserEmail: formData.userEmail,
        UserBirthDate: formData.userBirthDate
        ? formData.userBirthDate.toISOString().split('T')[0]
        : null,
        GenderUuid: formData.genderUuid || null,
      });

      dispatch(createUser(encryptedPayload)).unwrap();

      router.push('/validate-email-sent');
>>>>>>> f571f8d (chore: save current work before project cleanup)
    } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
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
      <h2 className='text-2xl mb-6 text-center font-semibold'>{title}</h2>
      <Input
        label='Prénom :'
        type='text'
        name='userFirstname'
        value={formData.userFirstname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userFirstname && !formData.userFirstname}
<<<<<<< HEAD
        infoText={
          touched.userFirstname && !formData.userFirstname
            ? 'Prénom requis'
            : ''
        }
        autoFocus={true}
=======
        infoText={touched.userFirstname && !formData.userFirstname ? t('validation:firstnameRequired') : ''}
        autoFocus
>>>>>>> f571f8d (chore: save current work before project cleanup)
        required
      />
      <Input
        label='Nom :'
        type='text'
        name='userLastname'
        value={formData.userLastname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userLastname && !formData.userLastname}
<<<<<<< HEAD
        infoText={
          touched.userLastname && !formData.userLastname ? 'Nom requis' : ''
        }
=======
        infoText={touched.userLastname && !formData.userLastname ? t('validation:lastnameRequired') : ''}
>>>>>>> f571f8d (chore: save current work before project cleanup)
        required
      />
      <Input
        label='Login :'
        type='text'
        name='userLogin'
        value={formData.userLogin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.userLogin && (loginError || apiErrors.Login)
            ? true
            : undefined
        }
        required
        helperText={touched.userLogin ? loginError || apiErrors.Login : ''}
      />
      <Input
        label='E-mail :'
        type='email'
        name='userEmail'
        value={formData.userEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.userEmail && (emailError || apiErrors.Email)
            ? true
            : undefined
        }
        required
        helperText={touched.userEmail ? emailError || apiErrors.Email : ''}
      />
      <Input
        label='Mot de passe :'
        type='password'
        name='userPassword'
        value={formData.userPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      <div className='text-base space-y-1'>
<<<<<<< HEAD
        <p
          className={
            passwordErrors['missingUppercase']
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          Majuscule requise
        </p>
        <p
          className={
            passwordErrors['missingLowercase']
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          Minuscule requise
        </p>
        <p
          className={
            passwordErrors['missingNumber']
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          Nombre requis
        </p>
        <p
          className={
            passwordErrors['missingSpecialChar']
              ? 'text-red-500'
              : 'text-green-500'
          }
        >
          Caractère spécial requis
        </p>
        <p
          className={
            passwordErrors['minLength'] ? 'text-red-500' : 'text-green-500'
          }
        >
          Au moins 8 caractères
=======
        <p className={passwordErrors.missingUppercase ? 'text-red-500' : 'text-green-500'}>
          {t('validation:password.uppercaseMissing')}
        </p>
        <p className={passwordErrors.missingLowercase ? 'text-red-500' : 'text-green-500'}>
          {t('validation:password.lowercaseMissing')}
        </p>
        <p className={passwordErrors.missingNumber ? 'text-red-500' : 'text-green-500'}>
          {t('validation:password.numberMissing')}
        </p>
        <p className={passwordErrors.missingSpecialChar ? 'text-red-500' : 'text-green-500'}>
          {t('validation:password.specialCharMissing')}
        </p>
        <p className={passwordErrors.minLength ? 'text-red-500' : 'text-green-500'}>
          {t('validation:password.minLength')}
>>>>>>> f571f8d (chore: save current work before project cleanup)
        </p>
      </div>
      <Input
        label='Confirmation mot de passe :'
        type='password'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
<<<<<<< HEAD
        error={
          touched.confirmPassword &&
          confirmPasswordError &&
          formData.confirmPassword.length > 0
            ? true
            : undefined
        }
        infoText={
          touched.confirmPassword &&
          confirmPasswordError &&
          formData.confirmPassword.length > 0
            ? confirmPasswordError
            : ''
        }
        required
      />
=======
        error={touched.confirmPassword && confirmPasswordError && formData.confirmPassword.length > 0 ? true : undefined}
        infoText={touched.confirmPassword && confirmPasswordError ? t('validation:password.passwordsNotMatching') : ''}
        required
      />

      <BirthDatePicker
          value={formData.userBirthDate}
          onChange={date => setFormData(prev => ({ ...prev, userBirthDate: date }))}
        />

      <div className='my-3'>
        <label className='block text-sm font-medium'>{t('form:gender')}</label>
        <select
          name='genderUuid'
          value={formData.genderUuid}
          onChange={handleChangeSelect}
          className='mt-1 block w-full border rounded p-2'
        >
          <option value=''>{t('form:selectGender')}</option>
          {genders?.map(g => (
            <option key={g.genderUuid} value={g.genderUuid}>
              {g.genderLabel}
            </option>
          ))}
        </select>
      </div>

>>>>>>> f571f8d (chore: save current work before project cleanup)
      <CustomButton
        text='Submit'
        onClick={handleSubmit}
        disable={!formValidator}
      />
    </FormWrapper>
  );
};

export default UserForm;

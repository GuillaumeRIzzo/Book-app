import { useEffect, useState } from 'react';
import styled from 'twin.macro';
import { addUser } from '@/api/userApi';
import CustomButton from '@/components/common/Button';
import Input from '@/components/common/Input';
import useEmailValidator from '@/hooks/useEmailValidator';
import useLoginValidator from '@/hooks/useLoginValidator';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';
import { User } from '@/models/user/User';
import Loading from '@/components/common/Loading';
import store, { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from './UserSlice';
import { useSession } from 'next-auth/react';

const FormWrapper = styled.div`
  w-2/4
  p-6 
`;

interface FormProps {
  title: string;
}

const UserForm: React.FC<FormProps> = ({ title }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) =>
    state.users.users.find((u: User) => u.userId === Number(id))
  );

  useEffect(() => {
    if (id && !user) {
      const userId = Number(id);
      if (!isNaN(userId)) {
        setLoading(true);
        if (session && userId !== Number(session.user.id)) {
          router.push(`/user/${session?.user.id}`);
        }
        store.dispatch(fetchUserById(userId)).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [dispatch, id, user, status]);

  const [formData, setFormData] = useState({
    userId: 0,
    userFirstname: '',
    userLastname: '',
    userPassword: '',
    userLogin: '',
    userEmail: '',
    userRight: 'User',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId,
        userFirstname: user.userFirstname,
        userLastname: user.userLastname,
        userPassword: '',
        userLogin: user.userLogin,
        userEmail: user.userEmail,
        userRight: user.userRight || 'User',
        confirmPassword: '',
      });
    }
  }, [user]);

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

  const handleSubmit = async () => {
    try {
      if (formValidator) {
        const result = await addUser(formData);
        console.log(result);
      } else {
        console.error('Validation failed');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { name, message } = error.response.data;
        setApiErrors(prevErrors => ({
          ...prevErrors,
          [name]: message,
        }));
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

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
        infoText={
          touched.userFirstname && !formData.userFirstname
            ? 'Prénom requis'
            : ''
        }
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
        infoText={
          touched.userLastname && !formData.userLastname ? 'Nom requis' : ''
        }
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
        </p>
      </div>
      <Input
        label='Confirmation mot de passe :'
        type='password'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
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
      <CustomButton
        text='Submit'
        onClick={handleSubmit}
        disable={!formValidator}
      />
    </FormWrapper>
  );
};

export default UserForm;

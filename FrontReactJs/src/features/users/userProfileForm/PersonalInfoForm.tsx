import React, { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { User } from '@/models/user/User';
import useEmailValidator from '@/hooks/useEmailValidator';
import useLoginValidator from '@/hooks/useLoginValidator';

interface PersonalInfoFormProps {
  user: User | undefined;
  onSubmit: (formData: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    userFirstname: '',
    userLastname: '',
    userLogin: '',
    userEmail: '',
    userRight: 'User',
  });

  const [touched, setTouched] = useState({
    userFirstname: false,
    userLastname: false,
    userLogin: false,
    userEmail: false,
  });

  const emailError = useEmailValidator(formData.userEmail);
  const loginError = useLoginValidator(formData.userLogin);

  useEffect(() => {
    if (user) {
      setFormData({
        userFirstname: user.userFirstname,
        userLastname: user.userLastname,
        userLogin: user.userLogin,
        userEmail: user.userEmail,
        userRight: user.userRight || 'User',
      });
    }
  }, [user]);

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

  const formValidator: boolean = 
    !emailError && !loginError && !!formData.userFirstname && !!formData.userLastname;

  const handleSubmit = () => {
    if (formValidator) {
      onSubmit(formData);
    } else {
      console.error('Validation failed');
    }
  };

  return (
    <form>
      <Input
        label='Prénom :'
        type='text'
        name='userFirstname'
        value={formData.userFirstname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userFirstname && !formData.userFirstname}
        infoText={touched.userFirstname && !formData.userFirstname ? 'Prénom requis' : ''}
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
        infoText={touched.userLastname && !formData.userLastname ? 'Nom requis' : ''}
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
          touched.userLogin && loginError
            ? true
            : undefined
        }
        required
        helperText={touched.userLogin ? loginError : ''}
      />
      <Input
        label='E-mail :'
        type='email'
        name='userEmail'
        value={formData.userEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.userEmail && emailError 
            ? true
            : undefined
        }
        required
        helperText={touched.userEmail ? emailError : ''}
      />
      <CustomButton
        text='Submit'
        onClick={handleSubmit}
        disable={!formValidator}
      />
    </form>
  );
};

export default PersonalInfoForm;

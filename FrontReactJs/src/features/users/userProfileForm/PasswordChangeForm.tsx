import React, { useEffect, useState } from 'react';
import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { User } from '@/models/user/user';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';

interface PasswordChangeFormProps {
  user: User | undefined;
  onSubmit: (formData: any, event: React.FormEvent<HTMLFormElement>) => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    UserId: user?.userId,
    CurrentPassword: '',
    NewPassword: ''
  });

  const [touched, setTouched] = useState({
    CurrentPassword: false,
    NewPassword: false,
  });

  const passwordErrors = usePasswordValidator(formData.CurrentPassword);
  const NewPasswordError = useConfirmPasswordValidator(
    formData.CurrentPassword,
    formData.NewPassword,
  );

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
  Object.values(passwordErrors).length < 1 && !NewPasswordError;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    if (formValidator) {
      onSubmit(formData, event); // Pass formData and event to parent handler
      setFormData({
        UserId: user?.userId,
        CurrentPassword: '',
        NewPassword: ''
      })
    } else {
      console.error('Validation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label='Mot de passe actuel :'
        type='password'
        name='CurrentPassword'
        value={formData.CurrentPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      <div className='text-base space-y-1'>
        <p className={passwordErrors['missingUppercase'] ? 'text-red-500' : 'text-green-500'}>
          Majuscule requise
        </p>
        <p className={passwordErrors['missingLowercase'] ? 'text-red-500' : 'text-green-500'}>
          Minuscule requise
        </p>
        <p className={passwordErrors['missingNumber'] ? 'text-red-500' : 'text-green-500'}>
          Nombre requis
        </p>
        <p className={passwordErrors['missingSpecialChar'] ? 'text-red-500' : 'text-green-500'}>
          Caractère spécial requis
        </p>
        <p className={passwordErrors['minLength'] ? 'text-red-500' : 'text-green-500'}>
          Au moins 8 caractères
        </p>
      </div>
      <Input
        label='Confirmation mot de passe :'
        type='password'
        name='NewPassword'
        value={formData.NewPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.NewPassword && NewPasswordError
            ? true
            : undefined
        }
        infoText={touched.NewPassword && NewPasswordError ? NewPasswordError : ''}
        required
      />
      <CustomButton
        text='Submit'
        type='submit'
        disable={!formValidator}
      />
    </form>
  );
};

export default PasswordChangeForm;

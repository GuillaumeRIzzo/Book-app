import React, { useState } from 'react';
import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import usePasswordValidator from '@/hooks/usePasswordValidator';
import useConfirmPasswordValidator from '@/hooks/useConfirmPasswordValidator';

interface PasswordChangeFormProps {
  onSubmit: (formData: any) => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    userPassword: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    userPassword: false,
    confirmPassword: false,
  });

  const passwordErrors = usePasswordValidator(formData.userPassword);
  const confirmPasswordError = useConfirmPasswordValidator(
    formData.userPassword,
    formData.confirmPassword,
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
  Object.values(passwordErrors).length < 1 && !confirmPasswordError;

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
        label='Mot de passe :'
        type='password'
        name='userPassword'
        value={formData.userPassword}
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
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.confirmPassword && confirmPasswordError
            ? true
            : undefined
        }
        infoText={touched.confirmPassword && confirmPasswordError ? confirmPasswordError : ''}
        required
      />
      <CustomButton
        text='Submit'
        onClick={handleSubmit}
        disable={!formValidator}
      />
    </form>
  );
};

export default PasswordChangeForm;

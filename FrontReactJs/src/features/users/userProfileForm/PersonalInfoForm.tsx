import { useState, useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { User } from '@/models/user/user';

import useEmailValidator from '@/hooks/useEmailValidator';
import useLoginValidator from '@/hooks/useLoginValidator';

interface PersonalInfoFormProps {
  user: User | undefined;
  right: string;
  onSubmit: (formData: any, event: React.FormEvent<HTMLFormElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ user, right, onSubmit }) => {
  const [formData, setFormData] = useState({
    UserId: user?.userId || 0,
    UserFirstname: user?.userFirstname || '',
    UserLastname: user?.userLastname || '',
    UserLogin: user?.userLogin || '',
    UserEmail: user?.userEmail || '',
    UserRight: user?.userRight || 'User',
  });

  const [touched, setTouched] = useState({
    userFirstname: false,
    userLastname: false,
    userLogin: false,
    userEmail: false,
    userRight: false
  });

  const emailError = useEmailValidator(formData.UserEmail);
  const loginError = useLoginValidator(formData.UserLogin);

  useEffect(() => {
    if (user) {
      setFormData({
        UserId: user.userId,
        UserFirstname: user.userFirstname,
        UserLastname: user.userLastname,
        UserLogin: user.userLogin,
        UserEmail: user.userEmail,
        UserRight: user.userRight,
      });
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const formValidator =
  !emailError &&
  !loginError &&
  !!formData.UserFirstname &&
  !!formData.UserLastname &&
  !!formData.UserRight;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    if (formValidator) {
      onSubmit(formData, event); // Pass formData and event to parent handler
    } else {
      console.error('Validation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Prénom :"
        type="text"
        name="userFirstname"
        value={formData.UserFirstname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userFirstname && !formData.UserFirstname}
        infoText={
          touched.userFirstname && !formData.UserFirstname
            ? 'Prénom requis'
            : ''
        }
        required
      />
      <Input
        label="Nom :"
        type="text"
        name="userLastname"
        value={formData.UserLastname}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userLastname && !formData.UserLastname}
        infoText={
          touched.userLastname && !formData.UserLastname
            ? 'Nom requis'
            : ''
        }
        required
      />
      <Input
        label="Login :"
        type="text"
        name="userLogin"
        value={formData.UserLogin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userLogin && !!loginError}
        helperText={touched.userLogin ? loginError : ''}
        required
      />
      <Input
        label="E-mail :"
        type="email"
        name="userEmail"
        value={formData.UserEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.userEmail && !!emailError}
        helperText={touched.userEmail ? emailError : ''}
        required
      />
      {right !== "User" &&
        <Select
        label="Right"
        name="UserRight"
        value={formData.UserRight}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        required
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="User">User</MenuItem>
      </Select>
      }

      
      <CustomButton text="Submit" type="submit" disable={!formValidator} />
    </form>
  );
};

export default PersonalInfoForm;

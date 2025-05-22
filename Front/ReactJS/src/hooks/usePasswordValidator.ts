import { useState, useEffect } from 'react';

const usePasswordValidator = (value: string) => {
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newErrors: { [key: string]: boolean } = {};
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&-_]/.test(value);
    const hasMinLength = value.length >= 8;

    if (!hasUppercase) {
      newErrors['missingUppercase'] = true;
    }
    if (!hasLowercase) {
      newErrors['missingLowercase'] = true;
    }
    if (!hasNumber) {
      newErrors['missingNumber'] = true;
    }
    if (!hasSpecialChar) {
      newErrors['missingSpecialChar'] = true;
    }
    if (!hasMinLength) {
      newErrors['minLength'] = true;
    }

    setErrors(newErrors);
  }, [value]);

  return errors;
};

export default usePasswordValidator;

import { useState, useEffect } from 'react';

const useConfirmPasswordValidator = (password: string, confirmPassword: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(password === confirmPassword ? null : 'Les mots de passe ne correspondent pas');
  }, [password, confirmPassword]);

  return error;
};

export default useConfirmPasswordValidator;

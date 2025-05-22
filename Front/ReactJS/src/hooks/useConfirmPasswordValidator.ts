import { useState, useEffect } from 'react';

const useConfirmPasswordValidator = (CurrentPassword: string, NewPassword: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(CurrentPassword === NewPassword ? null : 'Les mots de passe ne correspondent pas');
  }, [CurrentPassword, NewPassword]);

  return error;
};

export default useConfirmPasswordValidator;

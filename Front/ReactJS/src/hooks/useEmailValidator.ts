import { useState, useEffect } from 'react';

const useEmailValidator = (value: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    setError(isEmail ? null : 'E-mail invalide');
  }, [value]);

  return error;
};

export default useEmailValidator;

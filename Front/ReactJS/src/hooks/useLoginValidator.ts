import { useState, useEffect } from 'react';

const useLoginValidator = (value: string) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasAtSymbol = value.includes('@');

    if (value.trim().length < 1) {
      setError('Login requis');
    } else if (hasAtSymbol) {
      setError('Login ne doit pas contenir de @');
    } else {
      setError(null);
    }
  }, [value]);

  return error;
};

export default useLoginValidator;

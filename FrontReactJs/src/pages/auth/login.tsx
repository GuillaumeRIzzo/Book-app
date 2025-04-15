import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

import { saveSessionLocally } from '@api/auth/session';

import Input from '@/components/common/Input';
import CustomButton from '@/components/common/Button';
import { encryptPayload } from '@/utils/encryptUtils';

import styled from 'twin.macro';

const FormWrapper = styled.div`
  p-6 
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const router = useRouter();
  const { error } = router.query;

  const [apiErrors, setApiErrors] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (error) {
      setApiErrors('Invalid credentials. Please try again.');
    }
  }, [error]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrors(null);
  
    try {
      const result = await signIn('credentials', {
        redirect: false,
        encryptedPayload: JSON.stringify(encryptPayload({
          Identifier: formData.identifier,
          Password: formData.password,
        })),
      });
      if (result?.ok) {
        const session = await getSession();
        if (session) {
          saveSessionLocally(session);
          router.push('/');
        }
      } else {
        setApiErrors('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setApiErrors('An unexpected error occurred. Please try again later.');
    }
  };
  

  return (
    <FormWrapper>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Connexion
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSignIn}>
            <div>
              <div className='mt-2'>
                <Input
                  label='Login ou E-mail :'
                  type='text'
                  name='identifier'
                  value={formData.identifier}
                  onChange={handleChange}
                  autoFocus={true}
                  required
                />
              </div>
            </div>

            <div>
              {/* <div className='flex items-center justify-between'>
                <div className='text-sm'>
                  <a
                    href='#'
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </a>
                </div>
              </div> */}
              <div className='mt-2'>
                <Input
                  label='Mot de passe'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {apiErrors && <p className='text-red-500'>{apiErrors}</p>}

            <div className='mt-4'>
              <CustomButton text='Login' type='submit' />
            </div>
          </form>
        </div>
      </div>
    </FormWrapper>
  );
};

export default Login;

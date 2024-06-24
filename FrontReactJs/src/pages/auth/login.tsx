import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/common/Input";
import CustomButton from "@/components/common/Button";
import { signIn } from "next-auth/react";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { error } = router.query;

  const [apiErrors, setApiErrors] = useState<string | null>(null);
  
  useEffect(() => {
    if (error) {
      setApiErrors('Invalid credentials. Please try again.');
    }
  }, [error]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors(null);

    const result = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    if (result && result.error) {
      setApiErrors('Login / e-mail or password invalid');
    } else {
      router.push('/');
    }
  };

  return (
    <>
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
                  value={identifier}
                  required
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {apiErrors && 
              <p className="text-red-500">{apiErrors}</p>
            }

            <div className='mt-4'>
              <CustomButton
                text="Login"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

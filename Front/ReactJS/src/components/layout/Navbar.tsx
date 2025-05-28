import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Gravatar from 'react-gravatar';
import { decryptPayload } from '@/utils/encryptUtils';
import { SearchBar } from '../SearchBar';

const navigation = [
  { name: 'Accueil', href: '/', current: false },
  { name: 'Catégories', href: '/categories', current: false },
  { name: 'Auteurs', href: '/authors', current: false },
  { name: 'Éditeurs', href: '/publishers', current: false },
];

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  let token: string;
  let right: string;
  let email: string;
  let id: string;

  // Check if the session is available and contains the encrypted session
  if (session && session.user && session.user.encryptedSession) {
    const encryptedSession = session.user.encryptedSession; // Retrieve encrypted session data

    // Extract encrypted data and IV (if needed)
    const { encryptedData, iv } = encryptedSession;

    // Decrypt the session data
    try {
      const decryptedSessionData = decryptPayload(encryptedData, iv);

      // Cast the decrypted session data to the expected structure
      const {
        token: decryptedToken,
        right: decryptedRight,
        email: decryptedEmail,
        id: decryptedId,
      } = decryptedSessionData as {
        token: string;
        right: string;
        email: string;
        id: string;
      };

      token = decryptedToken;
      right = decryptedRight;
      email = decryptedEmail;
      id = decryptedId;
    } catch (error) {
      console.error('Failed to decrypt session data:', error);
    }
  }

  return (
    <Disclosure id="app-header" as='nav' className='bg-[#333]'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <DisclosureButton className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='absolute -inset-0.5' />
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </DisclosureButton>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'>
                    {navigation.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-base font-medium',
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name.toLocaleUpperCase()}
                      </Link>
                    ))}
                    {token && ['Super Admin', 'Admin'].includes(right) && (
                      <Link
                        href='/users'
                        className={
                          'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium'
                        }
                      >
                        UTILISATEURS
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <SearchBar />
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                {/* Profile dropdown */}
                {status === 'authenticated' ? (
                  <Menu as='div' className='relative ml-3'>
                    <div>
                      <MenuButton className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                        <span className='absolute -inset-1.5' />
                        <span className='sr-only'>Open user menu</span>
                        <Gravatar
                          email={email}
                          className='h-8 w-8 rounded-full'
                        />
                      </MenuButton>
                    </div>
                    <Transition
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <MenuItems className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href={`/user/${id}`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700',
                              )}
                            >
                              Votre Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href='/'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700',
                              )}
                              onClick={() => {
                                signOut();
                                localStorage.clear();
                              }}
                            >
                              Se déconnecter
                            </Link>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                ) : (
                  <div className='hidden sm:ml-6 sm:block'>
                    <div className='flex space-x-4'>
                      <Link
                        href='/signin'
                        className={classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-base font-medium',
                        )}
                        aria-current='page'
                      >
                        INSCRIPTION
                      </Link>
                      <Link
                        href='/login'
                        className={classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-base font-medium',
                        )}
                        aria-current='page'
                      >
                        CONNEXION
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className='sm:hidden'>
            <div className='space-y-1 px-2 pb-3 pt-2'>
              {navigation.map(item => (
                <DisclosureButton
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name.toLocaleUpperCase()}
                </DisclosureButton>
              ))}
              <DisclosureButton
                as='a'
                href='/signin'
                className='text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'
                aria-current={undefined}
              >
                INSCRIPTION
              </DisclosureButton>
              <DisclosureButton
                as='a'
                href='/login'
                className='text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'
                aria-current={undefined}
              >
                CONNEXION
              </DisclosureButton>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const { t } = useTranslation();

  let token = '';
  let right = '';
  let email = '';

  if (session && session.user && session.user.encryptedSession) {
    try {
      const { encryptedData, iv } = session.user.encryptedSession;
      const decryptedSessionData = decryptPayload(encryptedData, iv);
      const {
        token: decryptedToken,
        right: decryptedRight,
        email: decryptedEmail,
      } = decryptedSessionData as {
        token: string;
        right: string;
        email: string;
      };

      token = decryptedToken;
      right = decryptedRight;
      email = decryptedEmail;
    } catch (error) {
      console.error('Failed to decrypt session data:', error);
    }
  }

const navigation = [
  { name: t('navbar.home'), href: '/' },
  { name: t('navbar.categories'), href: '/categories' },
  { name: t('navbar.authors'), href: '/authors' },
  { name: t('navbar.publishers'), href: '/publishers' },
];

  return (
    <Disclosure id="app-header" as='nav' className='bg-navBar border-b-[1px] border-b-border'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                <DisclosureButton className='inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-gray-300 hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' />
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
                          pathname === item.href
                            ? 'bg-gray-300 text-primary-light'
                            : 'text-primary hover:bg-gray-300 hover:text-primary-light',
                          'rounded-md px-3 py-2 text-base font-medium',
                        )}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.name.toUpperCase()}
                      </Link>
                    ))}
                    {token && ['Super Admin', 'Admin'].includes(right) && (
                      <Link
                        href='/users'
                        className='text-primary hover:bg-gray-300 hover:text-primary-light rounded-md px-3 py-2 text-base font-medium'
                      >
                        {t('navbar.users').toUpperCase()}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <SearchBar />
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                {status === 'authenticated' ? (
                  <Menu as='div' className='relative ml-3'>
                    <MenuButton className='flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                      <Gravatar email={email} className='h-8 w-8 rounded-full' />
                    </MenuButton>
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
                              href={`/user/account`}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-primary-dark hover:text-primary-light',
                              )}
                            >
                              {t('navbar.yourAccount')}
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href='/'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-primary-dark hover:text-primary-light',
                              )}
                              onClick={() => {
                                signOut();
                                localStorage.clear();
                              }}
                            >
                              {t('navbar.logout')}
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
                        className='text-primary hover:bg-gray-300 hover:text-primary-light rounded-md px-3 py-2 text-base font-medium'
                      >
                        {t('navbar.signup').toUpperCase()}
                      </Link>
                      <Link
                        href='/login'
                        className='text-primary hover:bg-gray-300 hover:text-primary-light rounded-md px-3 py-2 text-base font-medium'
                      >
                        {t('navbar.login').toUpperCase()}
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
                    pathname === item.href
                      ? 'bg-gray-300 text-primary-light'
                      : 'text-primary hover:bg-gray-300 hover:text-primary-light',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name.toUpperCase()}
                </DisclosureButton>
              ))}
              {status !== 'authenticated' && (
                <>
                  <DisclosureButton
                    as='a'
                    href='/signin'
                    className='text-primary hover:bg-gray-300 hover:text-primary-light block rounded-md px-3 py-2 text-base font-medium'
                  >
                    {t('navbar.signup').toUpperCase()}
                  </DisclosureButton>
                  <DisclosureButton
                    as='a'
                    href='/login'
                    className='text-primary hover:bg-gray-300 hover:text-primary-light block rounded-md px-3 py-2 text-base font-medium'
                  >
                    {t('navbar.login').toUpperCase()}
                  </DisclosureButton>
                </>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

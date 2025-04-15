import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { AppDispatch, RootState } from '@/redux/store';

import { User } from '@/models/user/user';
import Loading from '@/components/common/Loading';

import PersonalInfoForm from './PersonalInfoForm';
import PasswordChangeForm from './PasswordChangeForm';
import AccountDeletionForm from './AccountDeletionForm';
import {
  fetchUserById,
  fetchUsersAsync,
  updateUserInState,
} from '../UserSlice';
import { updateUserInfos, updateUserPassword } from '@/api/userApi';
import {
  decryptPayload,
  EncryptedPayload,
  encryptPayload,
} from '@/utils/encryptUtils';

const FormWrapper = styled.div`
  ${tw`w-2/4 p-6`}
  form {
    ${tw`my-9`}
  }
`;

interface FormProps {
  title: string;
}

const UserProfileForm: React.FC<FormProps> = ({ title }) => {
  const { data: session } = useSession();
  const users = useSelector((state: RootState) => state.users.users);
  const UserStatus = useSelector((state: RootState) => state.users.status);

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  // Memoized userFind logic
  const userFind = useMemo(() => {
    return session
      ? users.find((u: User) => u.userId === Number(id))
      : undefined;
  }, [session, users, id]);

  // Memoized session decryption
  const { right, sessionId } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        const { id: decryptedId, right: decryptedRight } = decryptPayload(
          encryptedData,
          iv,
        );
        return { right: decryptedRight as string, sessionId: decryptedId as number};
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '', sessionId: '' };
  }, [session]);

  // Fetch users when UserStatus is idle
  useEffect(() => {
    if (UserStatus === 'idle') {
      dispatch(fetchUsersAsync());
    }
  }, [UserStatus, dispatch]);

  // User validation and redirection
  useEffect(() => {
    if (
      (userFind?.userRight === 'Super Admin' && right !== 'Super Admin') ||
      (right === 'User' && id != sessionId)
    ) {
      if (typeof window !== 'undefined') {
        router.replace('/');
      }
    }
  }, [userFind, right, id, sessionId, router]);

  // Fetch user by ID if not found
  useEffect(() => {
    if (id && !userFind) {
      const userId = Number(id);
      if (!isNaN(userId)) {
        setLoading(true);
        dispatch(fetchUserById(userId)).finally(() => setLoading(false));
      } else {
        setLoading(false);
        router.push('/');
      }
    } else {
      setLoading(false);
    }
  }, [id, userFind, dispatch, router]);

  const handlePersonalInfoSubmit = async (
    formData: any,
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.UserId !== undefined) {
        const { data: updatedUser } = await updateUserInfos(
          formData.UserId,
          encryptedPayload,
        );
        dispatch(updateUserInState(updatedUser));
        alert('User information updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert('Failed to update user information. Please try again.');
    }
  };

  const handlePasswordChangeSubmit = async (
    formData: any,
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      if (formData.UserId !== undefined) {
        const { data: updatedUser } = await updateUserPassword(
          formData.UserId,
          encryptedPayload,
        );
        dispatch(updateUserInState(updatedUser));
        alert('User password updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert('Failed to update user password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    // Placeholder for account deletion logic
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormWrapper>
      <h1 className='text-2xl mb-6 text-center font-semibold'>{title}</h1>
      <PersonalInfoForm
        user={userFind}
        right={right}
        onSubmit={handlePersonalInfoSubmit}
      />
      {userFind?.userId === Number(sessionId) && (
        <PasswordChangeForm
          user={userFind}
          onSubmit={handlePasswordChangeSubmit}
        />
      )}
      {userFind?.userRight !== 'Super Admin' && (
        <AccountDeletionForm onDelete={handleDeleteAccount} />
      )}
    </FormWrapper>
  );
};

export default UserProfileForm;

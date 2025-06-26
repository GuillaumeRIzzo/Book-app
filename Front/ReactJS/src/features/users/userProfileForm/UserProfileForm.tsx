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
import { updateUserInfos } from '@/api/userApi';
import { updateUserPassword } from '@/api/passwordApi';
import {
  decryptPayload,
  EncryptedPayload,
  encryptPayload,
} from '@/utils/encryptUtils';
import { selectUserModelViews } from '@/features/userViews/userViewSelectors';
import { Alert, AlertColor, Snackbar } from '@mui/material';

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
  const UserStatus = useSelector((state: RootState) => state.users.status);

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');

  // Memoized userFind logic
  const userViews = useSelector(selectUserModelViews);

  const userFind = useMemo(() => {
    return session
      ? userViews.find(u => u.user.userUuid === id)
      : undefined;
  }, [session, userViews, id]);

  // Memoized session decryption
  const { right, uuid } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        const decryptedData = decryptPayload<{ right: string, uuid: string }>(
          encryptedData,
          iv,
        );
        
        return { right: decryptedData.right, uuid: decryptedData.uuid};
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '', uuid: '' };
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
      (userFind?.right.userRightName === 'Super Admin' && right !== 'Super Admin') ||
      (right === 'User' && id != uuid)
    ) {
      if (typeof window !== 'undefined') {
        router.replace('/');
      }
    }
  }, [userFind, right, id, uuid, router]);

  // Fetch user by ID if not found
  useEffect(() => {
    if (id && !userFind) {
        dispatch(fetchUserById(id.toString())).finally(() => setLoading(false));
        router.push('/');
      }
      setLoading(false);
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
        setAlertMessage('User information updated successfully!');
        setAlertSeverity("success");
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      setAlertMessage('Failed to update user information. Please try again.');
      setAlertSeverity('error');
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
        setAlertMessage('User password updated successfully!');
        setAlertSeverity('success');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      setAlertMessage('Failed to update user password. Please try again.');
      setAlertSeverity('error');
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
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={5000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <h1 className='text-2xl mb-6 text-center font-semibold text-primary-dark'>{title}</h1>
      <PersonalInfoForm
        user={userFind}
        right={right}
        onSubmit={handlePersonalInfoSubmit}
      />
      {userFind?.user.userUuid === uuid && (
        <PasswordChangeForm
          user={userFind?.user}
          onSubmit={handlePasswordChangeSubmit}
        />
      )}
      {right !== 'Super Admin' && (
        <AccountDeletionForm onDelete={handleDeleteAccount} />
      )}
    </FormWrapper>
  );
};

export default UserProfileForm;

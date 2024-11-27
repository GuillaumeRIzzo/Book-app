import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import store, { RootState } from '@/redux/store';

import { User } from '@/models/user/user';
import Loading from '@/components/common/Loading';

import PersonalInfoForm from './PersonalInfoForm';
import PasswordChangeForm from './PasswordChangeForm';
import AccountDeletionForm from './AccountDeletionForm';
import { fetchUserById, updateUserInState } from '../UserSlice';
import { updateUserInfos, updateUserPassword } from '@/api/userApi';
import { EncryptedPayload, encryptPayload } from '@/utils/encryptUtils';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) =>
    state.users.users.find((u: User) => u.userId === Number(id)),
  );

  useEffect(() => {
    if (id && !user) {
      const userId = Number(id);
      if (!isNaN(userId)) {
        setLoading(true);
        if (session && userId !== Number(session.user.id)) {
          router.push(`/user/${session?.user.id}`);
        }
        store.dispatch(fetchUserById(userId)).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [dispatch, id, user, status]);

  const handlePersonalInfoSubmit = async (
    formData: any,
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const encryptedPayload: EncryptedPayload = encryptPayload(
        // Cast User type to Record<string, unknown> for encryption
        formData as Record<string, unknown>,
      );

      if (formData.UserId !== undefined) {
        // Call the API to update user details
        const { data: updatedUser } = await updateUserInfos(
          formData.UserId,
          encryptedPayload,
        );
      
        // Dispatch Redux action to update the state
        dispatch(updateUserInState(updatedUser));

        // Notify the user of success
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
    // Prevent the default form submission behavior
    try {
      // Cast User type to Record<string, unknown> for encryption
      const encryptedPayload: EncryptedPayload = encryptPayload(
        formData as Record<string, unknown>,
      );

      // Call the API to update user details
      if (formData.UserId !== undefined) {
        const { data: updatedUser } = await updateUserPassword(
          formData.UserId,
          encryptedPayload,
        );

      // Dispatch Redux action to update the state
      dispatch(updateUserInState(updatedUser));

      // Notify the user of success
      alert('User password updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert('Failed to update user password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    // try {
    //   const result = await deleteUser(user.userId); // Define deleteUser API call
    //   console.log(result);
    //   router.push('/'); // Redirect after deletion
    // } catch (error: any) {
    //   console.error(error);
    // }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormWrapper>
      <h2 className='text-2xl mb-6 text-center font-semibold'>{title}</h2>
      <PersonalInfoForm
        user={user}
        onSubmit={(formData, event) =>
          handlePersonalInfoSubmit(formData, event)
        }
      />
      <PasswordChangeForm
        user={user}
        onSubmit={(formData, event) =>
          handlePasswordChangeSubmit(formData, event)
        }
      />
      <AccountDeletionForm onDelete={handleDeleteAccount} />
    </FormWrapper>
  );
};

export default UserProfileForm;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import store, { RootState } from '@/redux/store';

import { User } from '@/models/user/User';
import Loading from '@/components/common/Loading';

import PersonalInfoForm from './PersonalInfoForm';
import PasswordChangeForm from './PasswordChangeForm';
import AccountDeletionForm from './AccountDeletionForm';
import { fetchUserById } from '../UserSlice';

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
    state.users.users.find((u: User) => u.userId === Number(id))
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

  const handlePersonalInfoSubmit = async (formData: any) => {
    // try {
    //   const result = await updateUser(formData); // Define updateUser API call
    //   console.log(result);
    // } catch (error: any) {
    //   console.error(error);
    // }
  };

  const handlePasswordChangeSubmit = async (formData: any) => {
    // try {
    //   const result = await changeUserPassword(formData); // Define changeUserPassword API call
    //   console.log(result);
    // } catch (error: any) {
    //   console.error(error);
    // }
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
      <PersonalInfoForm user={user} onSubmit={handlePersonalInfoSubmit} />
      <PasswordChangeForm onSubmit={handlePasswordChangeSubmit} />
      <AccountDeletionForm onDelete={handleDeleteAccount} />
    </FormWrapper>
  );
};

export default UserProfileForm;

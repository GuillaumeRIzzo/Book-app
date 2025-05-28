import React from 'react';
import CustomButton from '@/components/common/Button';

interface AccountDeletionFormProps {
  onDelete: () => void;
}

const AccountDeletionForm: React.FC<AccountDeletionFormProps> = ({ onDelete }) => {
  return (
    <form>
      <CustomButton
        text='Delete Account'
        onClick={onDelete}
        disable={false}
        color='error'
      />
    </form>
  );
};

export default AccountDeletionForm;

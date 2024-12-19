import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import store, { RootState } from '@/redux/store';
import { fetchUsersAsync } from './UserSlice';
import Loading from '@/components/common/Loading';
import { Dialog } from '@/components/common/dialog';
import { User } from '@/models/user/user';
import { decryptPayload } from '@/utils/encryptUtils';

const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const status = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);
  const router = useRouter();

  const { data: session } = useSession();
  let token: string = '';
  let right: string = '';

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  useEffect(() => {
    if (status === 'idle') {
      store.dispatch(fetchUsersAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // Check if the session is available and contains the encrypted session
  if (session && session.user && session.user.encryptedSession) {
    const encryptedSession = session.user.encryptedSession; // Retrieve encrypted session data

    // Extract encrypted data and IV (if needed)
    const { encryptedData, iv } = encryptedSession;

    // Decrypt the session data
    try {
      const decryptedSessionData = decryptPayload(encryptedData, iv);

      // Cast the decrypted session data to the expected structure
      const { token: decryptedToken, right: decryptedRight } =
        decryptedSessionData as {
          token: string;
          right: string;
        };

      token = decryptedToken;
      right = decryptedRight;
    } catch (error) {
      console.error('Failed to decrypt session data:', error);
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogTitle('Edit User');
    setDialogContent(`Edit user: ${user.userLogin}`);
    setDialogAction(() => () => {
      router.push(`/user/${user.userId}`);
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDialogTitle('Delete User');
    setDialogContent(
      `Are you sure you want to delete user: ${user.userLogin}?`,
    );
    setDialogAction(() => () => {
      // dispatch(deleteUser(user.userId));
      handleCloseDialog();
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const rows = users.map(user => ({
    ...user,
    id: user.userId,
  }));

  const columns: GridColDef[] = [
    ...(right !== null && (right === 'Admin' || right === 'Super Admin')
      ? [{ field: 'userId', headerName: 'ID' }]
      : []),
    { field: 'userFirstname', headerName: 'Prénom' },
    { field: 'userLastname', headerName: 'Nom' },
    { field: 'userLogin', headerName: 'Login' },
    { field: 'userEmail', headerName: 'E-mail', width: 200 },
    { field: 'userRight', headerName: 'Droit', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: params => {
        // Only show action buttons based on logged-in user's rights
        const userRight = params.row.userRight;

        // Admin cannot modify Super Admin users
        if (right === 'Admin' && userRight === 'Super Admin') {
          return null;
        }
        return (
          <>
            <IconButton
              color='primary'
              aria-label='edit user'
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color='secondary'
              aria-label='delete user'
              onClick={() => handleDelete(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        autoHeight
        autosizeOnMount
        density='comfortable'
        hideFooter
        disableRowSelectionOnClick
      />
      {selectedUser && (
        <Dialog
          open={openDialog}
          title={dialogTitle}
          content={dialogContent}
          onClose={handleCloseDialog}
          onSuccess={dialogAction}
        />
      )}
    </Box>
  );
};

export default UserList;

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { AppDispatch } from '@/redux/store';
import { fetchUsersAsync } from './UserSlice';
import Loading from '@/components/common/Loading';
import { Dialog } from '@/components/common/dialog';
import { decryptPayload } from '@/utils/encryptUtils';
import { selectUserError, selectUserStatus } from './userSelector';
import { User } from '@/models/user/user';
import { selectUserModelViews } from '../userViews/userViewSelectors';
import { setUserViews } from '../userViews/userViewSlice';
import { selectUserRightStatus } from '../userRights/userRightSelector';
import { fetchUserRightsAsync } from '../userRights/UserRightSlice';
import { UserModelView } from '@/models/userViews/UserModelView';

const UserList: React.FC = () => {
  const userStatus = useSelector(selectUserStatus);
  const rightStatus = useSelector(selectUserRightStatus);
  const userError = useSelector(selectUserError);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsersAsync());
      dispatch(fetchUserRightsAsync());
    }
  }, [userStatus]);

  const { right } = useMemo(() => {
    if (session?.user?.encryptedSession) {
      const { encryptedData, iv } = session.user.encryptedSession;
      try {
        // Explicitly cast the decrypted data to the expected type
        const decryptedData = decryptPayload<{ right: string }>(encryptedData, iv);
        return { right: decryptedData.right };
      } catch (error) {
        console.error('Failed to decrypt session data:', error);
      }
    }
    return { right: '' };
  }, [session]);

  const userViews = useSelector(selectUserModelViews);
  useEffect(() => {
      const allSucceeded = [
        userStatus,
        rightStatus
      ].every(status => status === 'succeeded');
  
      if (allSucceeded && userViews.length > 0) {
        dispatch(setUserViews(userViews));
      }
    }, [userStatus, rightStatus, userViews]);
  

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogTitle('Edit User');
    setDialogContent(`Edit user: ${user.userLogin}`);
    setDialogAction(() => () => {
      router.push(`/user/${user.userUuid}`);
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

  const rows = userViews.map((user: UserModelView) => ({
    ...user.user,
    id: user.user.userId,
    userRight: user.right.userRightName
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
            {userRight !== "Super Admin" &&
              <IconButton
              color='secondary'
              aria-label='delete user'
              onClick={() => handleDelete(params.row)}
            >
              <DeleteIcon />
            </IconButton>}
          </>
        );
      },
    },
  ];

  if (userStatus === 'loading') {
    return <Loading />;
  }

  if (userStatus === 'failed') {
    return <div>Error: {userError}</div>;
  }
  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        // checkboxSelection
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

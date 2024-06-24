import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Loading from '@/components/common/Loading';
import store, { RootState } from '@/redux/store';
import { fetchAuthorsAsync } from './AuthorSlice';

const columns: GridColDef[] = [
  { field: 'authorId', headerName: 'ID'},
  { field: 'authorName', headerName: 'Nom'},
];

const AuthorList: React.FC = () => {
  const dispatch = useDispatch();
  const authors = useSelector((state: RootState) => state.authors.authors);
  const status = useSelector((state: RootState) => state.authors.status);
  const error = useSelector((state: RootState) => state.authors.error);

  useEffect(() => {
    if (status === 'idle') {
      store.dispatch(fetchAuthorsAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = authors.map(author => ({
    ...author,
    id: author.authorId,
  }));

  return (
    <Box>
      <DataGrid 
        rows={rows}
        columns={columns}
        checkboxSelection
        autoHeight
        autosizeOnMount
        density='comfortable'
        hideFooterPagination
      />
    </Box>
  );
};

export default AuthorList;

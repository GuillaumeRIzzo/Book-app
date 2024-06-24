import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Loading from '@/components/common/Loading';
import store, { RootState } from '@/redux/store';
import { fetchBookCategoriesAsync } from './BookCategorySlice';

const columns: GridColDef[] = [
  { field: 'bookCategoId', headerName: 'ID'},
  { field: 'bookCategoName', headerName: 'Nom'},
  { field: 'bookCategoDescription', headerName: 'Decription', width:1100},
];

const BookCategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const bookCategories = useSelector((state: RootState) => state.bookCategories.bookCategories);
  const status = useSelector((state: RootState) => state.bookCategories.status);
  const error = useSelector((state: RootState) => state.bookCategories.error);

  useEffect(() => {
    if (status === 'idle') {
      store.dispatch(fetchBookCategoriesAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = bookCategories.map(categos => ({
    ...categos,
    id: categos.bookCategoId,
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

export default BookCategoryList;

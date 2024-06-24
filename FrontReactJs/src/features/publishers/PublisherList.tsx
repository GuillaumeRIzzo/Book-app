import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Loading from '@/components/common/Loading';
import store, { RootState } from '@/redux/store';
import { fetchPublishersAsync } from './PublisherSlice';

const columns: GridColDef[] = [
  { field: 'publisherId', headerName: 'ID'},
  { field: 'publisherName', headerName: 'Nom'},
];

const PublisherList: React.FC = () => {
  const dispatch = useDispatch();
  const publishers = useSelector((state: RootState) => state.publishers.publishers);
  const status = useSelector((state: RootState) => state.publishers.status);
  const error = useSelector((state: RootState) => state.publishers.error);

  useEffect(() => {
    if (status === 'idle') {
      store.dispatch(fetchPublishersAsync());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const rows = publishers.map(publisher => ({
    ...publisher,
    id: publisher.publisherId,
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

export default PublisherList;

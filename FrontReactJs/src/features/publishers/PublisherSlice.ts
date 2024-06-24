import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Publisher } from '@/models/publisher/Publisher';
import { PublisherState } from '@/models/publisher/PublisherState';
import { getPublisher, getPublishers } from '@/api/publisherApi';

export const fetchPublishersAsync = createAsyncThunk('publishers/getPublishers', async () => {
  const response = await getPublishers();
  return response.data;
});

export const fetchPublisherById = createAsyncThunk(
  'publishers/fetchById',
  async (publisherId: number) => {
    const response = await getPublisher(publisherId);
    return response.data;
  }
);

const initialState: PublisherState = {
  publishers: [],
  status: 'idle',
  error: null,
};

const publishersSlice = createSlice({
  name: 'publishers',
  initialState,
  reducers: {
    addPublisher: (state, action: PayloadAction<Publisher>) => {
      state.publishers.push(action.payload);
    },
    setPublishers: (state, action: PayloadAction<Publisher[]>) => {
      state.publishers = action.payload;
    },
    setStatus: (state, action: PayloadAction<PublisherState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPublishersAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPublishersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.publishers = action.payload;
      })
      .addCase(fetchPublishersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchPublisherById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublisherById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.publishers.push(action.payload);
      })
      .addCase(fetchPublisherById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addPublisher, setPublishers, setStatus, setError } = publishersSlice.actions;

export default publishersSlice.reducer;

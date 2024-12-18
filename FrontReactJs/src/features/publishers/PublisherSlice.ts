import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { Publisher } from '@/models/publisher/Publisher';
import { PublisherState } from '@/models/publisher/PublisherState';
import { getPublisher, getPublishers } from '@/api/publisherApi';
import { decryptPayload } from '@/utils/encryptUtils';

export const fetchPublishersAsync = createAsyncThunk('publishers/getPublishers', async () => {
  try {
    const response = await getPublishers();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let publishers: Publisher[];
    try {
      publishers = camelCaseKeys(decryptedData, {deep: true}) as unknown as Publisher[];
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }
    return publishers;

  } catch (error) {
    console.error('Failed to fetch publishers:', error);
    throw error;
  }
});

export const fetchPublisherById = createAsyncThunk(
  'publishers/fetchById',
  async (publisherId: number) => {
    try {
      // Call API to fetch encrypted publisher data
      const response = await getPublisher(publisherId);

       // Ensure data types for encrypted payload
       const encryptedData = response.data.encryptedData as string;
       const iv = response.data.iv as string;

       // Decrypt the data
       const decryptedData = decryptPayload(encryptedData, iv);
 
      const publisher = camelCaseKeys(decryptedData, {deep: true}) as unknown as Publisher;
      return publisher;
    } catch (error) {
      console.error('Failed to fetch publisher:', error);
      throw error; // Throw error to handle it in UI
    }
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

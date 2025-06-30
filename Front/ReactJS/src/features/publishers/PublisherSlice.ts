import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { Publisher } from '@/models/publisher/publisher';
import { PublisherState } from '@/models/publisher/PublisherState';
import { getPublisher, getPublishers, addPublisher, updatePublisher } from '@/api/publisherApi';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';
import { AxiosError } from 'axios';

export const fetchPublishersAsync = createAsyncThunk('publishers/getPublishers', async () => {
  try {
    const response = await getPublishers();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload<typeof response.data>(encryptedData, iv);

    let publishers: Publisher[];

    try {
          if (Array.isArray(decryptedData)) {
            publishers = mapIdToCustomKeys(
              camelCaseKeys(decryptedData, { deep: true }) as unknown as Publisher[],
              ModelType.Publisher
            );
          } else {
            console.error('Decrypted data is not an array of publishers:', decryptedData);
            throw new Error('Decrypted data is not valid Publisher[]');
          }
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

interface DecryptedPublicherData {
  publisherId: string;
  publisherUuid: string;
  [key: string]: unknown;
}

export const fetchPublisherById = createAsyncThunk(
  'publishers/fetchById',
  async (publisherId: string) => {
    try {
      // Call API to fetch encrypted publisher data
      const response = await getPublisher(publisherId);

       // Ensure data types for encrypted payload
       const encryptedData = response.data.encryptedData as string;
       const iv = response.data.iv as string;

       // Decrypt the data
       const decryptedData = decryptPayload<DecryptedPublicherData>(encryptedData, iv);
 
      const publisher = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        publisherId: decryptedData.id, // manually set the publisherId
      } as Publisher;

      return publisher;
    } catch (error) {
      console.error('Failed to fetch publisher:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

export const createPublisher = createAsyncThunk(
  'publishers/createPublisher',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addPublisher(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
      return rejectWithValue('Erreur inconnue');
    }
  }
);

type UpdatePublisherParams = {
  publisherId: number;
  payload: EncryptedPayload;
};

export const updatePublisherAsync = createAsyncThunk(
  'publishers/updatePublisher',
  async ({ publisherId, payload }: UpdatePublisherParams) => {
    // PUT doesn't return anything, so just call and return what you already know
    try {
      await updatePublisher(publisherId, payload);
      
      return { publisherId, decrypted: decryptPayload(payload.encryptedData, payload.iv) };
    }
    catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update publisher:', error);
      }
      // Throw error to handle it in UI
      throw error; 
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
    addPublisherLocal: (state, action: PayloadAction<Publisher>) => {
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
      // Fetch all
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

      // Fetch one
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
      })

      // Create
      .addCase(createPublisher.pending, state => {
        state.status = 'loading';
      })
      .addCase(createPublisher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.publishers.push(action.payload);
      })
      .addCase(createPublisher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      
      // Update
      .addCase(updatePublisherAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updatePublisherAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { publisherId, decrypted } = action.payload;
        const index = state.publishers.findIndex((publisher: { publisherId: number; }) => publisher.publisherId === publisherId);
        
        if (index !== -1) {
          state.publishers[index] = {
            ...state.publishers[index],
            ...decrypted
          };
        }
      })
      .addCase(updatePublisherAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addPublisherLocal, setPublishers, setStatus, setError } = publishersSlice.actions;

export default publishersSlice.reducer;

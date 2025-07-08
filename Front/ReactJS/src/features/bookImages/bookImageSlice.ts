import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BookImage } from '@/models/bookImages/bookImages';
import { BookImagesState } from '@/models/bookImages/bookImagesState';
import { addImage, updateImage, delImage } from '@/api/bookImagesApi';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const createImage = createAsyncThunk(
  'images/createImage',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addImage(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
    }
  }
);

type UpdateBookImagesParams = {
  imageUuid: string;
  payload: EncryptedPayload;
};

export const updateImageAsync = createAsyncThunk(
  'images/updateImage',
  async ({ imageUuid, payload }: UpdateBookImagesParams) => {
    try {
      await updateImage(imageUuid, payload);
      
      return { imageUuid, decryped : decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update book:', axiosError.response);
      }
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

export const deleteImageAsync = createAsyncThunk(
  'images/deleteImage',
  async (imageId: number) => {
    try {
      await delImage(imageId);
      return imageId;
    } catch (error) {
      console.error('Failed to delete book:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);

const initialState: BookImagesState = {
  images: [],
  status: 'idle',
  error: null,
};

const bookImagesSlice = createSlice({
  name: 'bImages',
  initialState,
  reducers: {
    addBookImageLocal: (state, action: PayloadAction<BookImage>) => {
      state.images.push(action.payload);
    },
    setBookImages: (state, action: PayloadAction<BookImage[]>) => {
      state.images = action.payload;
    },
    setStatus: (state, action: PayloadAction<BookImagesState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Create
      .addCase(createImage.pending, state => {
        state.status = 'loading';
      })
      .addCase(createImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images.push(action.payload);
      })
      .addCase(createImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Update
      .addCase(updateImageAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateImageAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { imageUuid, decryped } = action.payload;
        const index = state.images.findIndex(book => book.imageUuid === imageUuid);
        if (index !== -1) {
          state.images[index] = {
            ...state.images[index],
            ...decryped
          };
        }
      })
      .addCase(updateImageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Delete
      .addCase(deleteImageAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteImageAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = state.images.filter(book => book.imageId !== action.payload);
      })
      .addCase(deleteImageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBookImageLocal, setBookImages, setStatus, setError } = bookImagesSlice.actions;

export default bookImagesSlice.reducer;

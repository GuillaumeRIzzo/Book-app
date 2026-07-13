import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { BookImage } from '@/models/bookImages/bookImages';
import { BookImagesState } from '@/models/bookImages/bookImagesState';
import { getImages, getImage, addImage, updateImage, delImage } from '@/api/bookImagesApi';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';
import { AxiosError } from 'axios';


export const fetchBookImagessAsync = createAsyncThunk('bookImages/getImages', async () => {
  try {
    const response = await getImages();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;
    
    const decryptedData = decryptPayload<typeof response.data>(encryptedData, iv);

    let bookImages: BookImage[];

    try {
      if (Array.isArray(decryptedData)) {
        bookImages = mapIdToCustomKeys(
          camelCaseKeys(decryptedData, { deep: true }) as unknown as BookImage[],
          ModelType.Book
        );
      } else {
        console.error('Decrypted data is not an array of bookImages:', decryptedData);
        throw new Error('Decrypted data is not valid Book[]');
      }
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return bookImages;

  } catch (error) {
    console.error('Failed to fetch bookImages:', error);
    throw error;
  }
});

interface DecryptedBookImageData {
  imageId: string;
  imageUuid: string;
  [key: string]: unknown;
}

export const fetchBookImagesByUuid = createAsyncThunk(
  'bookImages/getImage',
  async (imageUuid: string) => {
    try {
      const response = await getImage(imageUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt data
      const decryptedData = decryptPayload<DecryptedBookImageData>(encryptedData, iv);

      // DecryptedData is a single Book object here
      const book = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        imageId: decryptedData.id, // manually set the imageUuid
      } as BookImage;

      return book;
    } catch (error) {
      console.error('Failed to fetch book:', error);
      throw error;
    }
  }
);

export const createImage = createAsyncThunk(
  'bookImages/createImage',
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
  'bookImages/updateImage',
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
  'bookImages/deleteImage',
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
  bookImages: [],
  status: 'idle',
  error: null,
};

const bookImagesSlice = createSlice({
  name: 'bookImages',
  initialState,
  reducers: {
    addBookImageLocal: (state, action: PayloadAction<BookImage>) => {
      state.bookImages.push(action.payload);
    },
    setBookImages: (state, action: PayloadAction<BookImage[]>) => {
      state.bookImages = action.payload;
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
    // Fetch all
      .addCase(fetchBookImagessAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchBookImagessAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookImages = action.payload;
      })
      .addCase(fetchBookImagessAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch one
      .addCase(fetchBookImagesByUuid.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookImagesByUuid.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookImages.push(action.payload);
      })
      .addCase(fetchBookImagesByUuid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
    
      // Create
      .addCase(createImage.pending, state => {
        state.status = 'loading';
      })
      .addCase(createImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookImages.push(action.payload);
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
        const index = state.bookImages.findIndex(book => book.imageUuid === imageUuid);
        if (index !== -1) {
          state.bookImages[index] = {
            ...state.bookImages[index],
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
        state.bookImages = state.bookImages.filter(book => book.imageId !== action.payload);
      })
      .addCase(deleteImageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBookImageLocal, setBookImages, setStatus, setError } = bookImagesSlice.actions;

export default bookImagesSlice.reducer;

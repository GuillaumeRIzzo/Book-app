import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { BookImage } from '@/models/bookImages/bookImages';
import { BookImagesState } from '@/models/bookImages/bookImagesState';
import { getImages, getImage, addImage, updateImage, delImage } from '@/api/bookImagesApi';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';
import { AxiosError } from 'axios';

export const fetchImagesAsync = createAsyncThunk('images/getImages', async () => {
  try {
    const response = await getImages();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;
    
    const decryptedData = decryptPayload<typeof response.data>(encryptedData, iv);

    let images: BookImage[];

    try {
      if (Array.isArray(decryptedData)) {
        images = mapIdToCustomKeys(
          camelCaseKeys(decryptedData, { deep: true }) as unknown as BookImage[],
          ModelType.Book
        );
      } else {
        console.error('Decrypted data is not an array of images:', decryptedData);
        throw new Error('Decrypted data is not valid Book[]');
      }
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return images;

  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
});

interface DecryptedImageData {
  imageId: string;
  imageUuid: string;
  [key: string]: unknown;
}

export const fetchImageByUuid = createAsyncThunk(
  'images/getImage',
  async (imageUuid: string) => {
    try {
      const response = await getImage(imageUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt data
      const decryptedData = decryptPayload<DecryptedImageData>(encryptedData, iv);

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
      // Fetch all
      .addCase(fetchImagesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchImagesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchImagesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch one
      .addCase(fetchImageByUuid.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchImageByUuid.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images.push(action.payload);
      })
      .addCase(fetchImageByUuid.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

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

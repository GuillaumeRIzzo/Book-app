import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { addCategory, getCategories, getCategory, updateCategory } from '@/api/categoryApi';
import { Category } from '@/models/category/Category';
import { CategoryState } from '@/models/category/CategoryState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';
import { AxiosError } from 'axios';

export const fetchCategoriesAsync = createAsyncThunk('categories/getCategories', 
  async (languageUuid?: string) => {
  try {
    const response = await getCategories(languageUuid);

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload<typeof response.data>(encryptedData, iv);

    let categos: Category[];

    try {
      if (Array.isArray(decryptedData)) {
        categos = mapIdToCustomKeys(
          camelCaseKeys(decryptedData, { deep: true }) as unknown as Category[],
          ModelType.Category
        );
      } else {
        console.error('Decrypted data is not an array of categos:', decryptedData);
        throw new Error('Decrypted data is not valid Category[]');
      }
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return categos;

  } catch (error) {
    console.error('Failed to fetch Categories:', error);
    throw error;
  }
});

interface DecryptedCategoryData {
  categoryId: string;
  categoryUuid: string;
  CategoryName: string;
  [key: string]: unknown;
}

export const fetchCategoryById = createAsyncThunk(
  'category/fetchById',
  async ({ categoryUuid, languageUuid }: { categoryUuid: string; languageUuid?: string }) => {
    try {
      // Call API to fetch encrypted author data
      const response = await getCategory(categoryUuid, languageUuid);

      // Ensure data types for encrypted payload
      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt the data
      const decryptedData = decryptPayload<DecryptedCategoryData>(encryptedData, iv);

      const author = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        categoryId: decryptedData.id, // manually set the bookId
      } as Category;

      return author;
    } catch (error) {
      console.error('Failed to fetch author:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addCategory(payload);
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

type UpdateCategoryParams = {
  categoryId: number;
  payload: EncryptedPayload;
};

export const updateCategoryAsync = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, payload }: UpdateCategoryParams) => {
    try {
      await updateCategory(categoryId, payload);

      return { categoryId, decrypted: decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update book category:', error);
      }
      // Throw error to handle it in UI
      throw error;
    }
  }
);

const initialState: CategoryState = {
  categories: [],
  status: 'idle',
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    setBooks: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setStatus: (state, action: PayloadAction<CategoryState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all
      .addCase(fetchCategoriesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch one
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Create
      .addCase(createCategory.pending, state => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Update
      .addCase(updateCategoryAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { categoryId, decrypted } = action.payload;
        const index = state.categories.findIndex(category => category.categoryId === categoryId);
        if (index !== -1) {
          state.categories[index] = {
            ...state.categories[index],
            ...decrypted
          };
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addBook, setBooks, setStatus, setError } = categorySlice.actions;

export default categorySlice.reducer;

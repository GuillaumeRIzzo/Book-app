import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getAuthor, getAuthors, addAuthor, updateAuthor } from '@/api/authorApi';
import { Author } from '@/models/author/author';
import { AuthorState } from '@/models/author/AuthorState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';
import { AxiosError } from 'axios';

export const fetchAuthorsAsync = createAsyncThunk('authors/getAuthors', 
  async (languageUuid?: string) => {
  try {
    const response = await getAuthors(languageUuid);

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload<typeof response.data>(encryptedData, iv);

    let authors: Author[];
    try {
      if (Array.isArray(decryptedData)) {
        authors = mapIdToCustomKeys(
          camelCaseKeys(decryptedData, { deep: true }) as unknown as Author[],
          ModelType.Author
        );
      } else {
        console.error('Decrypted data is not an array of authors:', decryptedData);
        throw new Error('Decrypted data is not valid Author[]');
      }
    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return authors;

  } catch (error) {
    console.error('Failed to fetch authors:', error);
    throw error;
  }
});

interface DecryptedAuthorData {
  authorId: string;
  authorUuid: string;
  authorFullName: string;
  [key: string]: unknown;
}

export const fetchAuthorById = createAsyncThunk(
  'authors/getAuthor',
  async ({ authorUuid, languageUuid }: { authorUuid: string; languageUuid?: string }) => {
    try {
      // Call API to fetch encrypted author data
      const response = await getAuthor(authorUuid, languageUuid);

      // Ensure data types for encrypted payload
      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt the data
      const decryptedData = decryptPayload<DecryptedAuthorData>(encryptedData, iv);
      
      const author = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        authorId: decryptedData.id, // manually set the authorId
      } as Author;
      
      return author;
    } catch (error) {
      console.error('Failed to fetch author:', error);
      throw error; // Throw error to handle it in UI
    }
  }
);

export const createAuthor = createAsyncThunk(
  'authors/createAuthor',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addAuthor(payload);
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

type UpdateAuthorParams = {
  authorUuid: string;
  payload: EncryptedPayload;
};

export const updateAuthorAsync = createAsyncThunk(
  'authors/updateAuthor',
  async ({ authorUuid, payload }: UpdateAuthorParams, { rejectWithValue }) => {
    try {
      await updateAuthor(authorUuid, payload);

      return {
        authorUuid,
        decrypted: decryptPayload(payload.encryptedData, payload.iv),
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update author:', error);
        return rejectWithValue(axiosError.response.data); // ✅
      }
      throw error; // <- ou return rejectWithValue('Unknown error')
    }
  }
);

const initialState: AuthorState = {
  authors: [],
  status: 'idle',
  error: null,
};

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    addAuthorLocal: (state, action: PayloadAction<Author>) => {
      state.authors.push(action.payload);
    },
    setAuthors: (state, action: PayloadAction<Author[]>) => {
      state.authors = action.payload;
    },
    setStatus: (state, action: PayloadAction<AuthorState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all
      .addCase(fetchAuthorsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAuthorsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authors = action.payload;
      })
      .addCase(fetchAuthorsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch one
      .addCase(fetchAuthorById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authors.push(action.payload);
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Create
      .addCase(createAuthor.pending, state => {
        state.status = 'loading';
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authors.push(action.payload);
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Update
      .addCase(updateAuthorAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateAuthorAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { authorUuid, decrypted } = action.payload;
        const index = state.authors.findIndex((author: { authorUuid: string; }) => author.authorUuid === authorUuid);
        if (index !== -1) {
          state.authors[index] = {
            ...state.authors[index],
            ...decrypted
          };
        }
      })
      .addCase(updateAuthorAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addAuthorLocal, setAuthors, setStatus, setError } = authorsSlice.actions;

export default authorsSlice.reducer;

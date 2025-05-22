import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getAuthor, getAuthors, addAuthor, updateAuthor } from '@/api/authorApi';
import { Author } from '@/models/author/author';
import { AuthorState } from '@/models/author/AuthorState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { mapIdToCustomKeys, ModelType } from '@/utils/mapIdToCustomKeys';

export const fetchAuthorsAsync = createAsyncThunk('authors/getAuthors', async () => {
  try {
    const response = await getAuthors();

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

export const fetchAuthorById = createAsyncThunk(
  'authors/getAuthor',
  async (authorId: number) => {
    try {
      // Call API to fetch encrypted author data
      const response = await getAuthor(authorId);

      // Ensure data types for encrypted payload
      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      // Decrypt the data
      const decryptedData = decryptPayload(encryptedData, iv);
      
      const author = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        authorId: (decryptedData as any).id, // manually set the authorId
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
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

type UpdateAuthorParams = {
  authorId: number;
  payload: EncryptedPayload;
};

export const updateAuthorAsync = createAsyncThunk(
  'authors/updateAuthor',
  async ({ authorId, payload }: UpdateAuthorParams) => {
    try {
      await updateAuthor(authorId, payload);

      return { authorId, decrypted: decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error: any) {
      console.error('Failed to update author:', error);
      // Throw error to handle it in UI
      throw error;
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
        const { authorId, decrypted } = action.payload;
        const index = state.authors.findIndex((author: { authorId: number; }) => author.authorId === authorId);
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

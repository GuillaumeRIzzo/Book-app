import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getLanguage, getLanguages, addLanguage } from '@/api/languageApi';
import { Language } from '@/models/language/language';
import { LanguageState } from '@/models/language/languageState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const fetchLanguagesAsync = createAsyncThunk('languages/getLanguages', async () => {
  try {
    const response = await getLanguages();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let languages: Language[];
    try {
      languages = camelCaseKeys(decryptedData, { deep: true }) as unknown as Language[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return languages;
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    throw error;
  }
});

interface DecryptedLanguageData {
  languageId: string;
  languageUuid: string;
  [key: string]: unknown;
}

export const fetchLanguageById = createAsyncThunk(
  'languages/getLanguage',
  async (languageUuid: string) => {
    try {
      const response = await getLanguage(languageUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedLanguageData>(encryptedData, iv);

      // Parse decrypted data as a Language object
      const language = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        languageId: decryptedData.id, // manually set the bookUuid
      } as Language;

      return language;
    } catch (error) {
      console.error('Failed to fetch language by ID:', error);
      throw error;
    }
  }
);

export const createLanguage = createAsyncThunk(
  'publishers/createLanguage',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addLanguage(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
    }
  }
);

// Initial state setup
const initialState: LanguageState = {
  languages: [],
  status: 'idle',
  error: null,
};

const languagesSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    addLanguageLocal: (state, action: PayloadAction<Language>) => {
      state.languages.push(action.payload);
    },
    setLanguages: (state, action: PayloadAction<Language[]>) => {
      state.languages = action.payload;
    },
    setStatus: (state, action: PayloadAction<LanguageState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateLanguageInState: (state, action: PayloadAction<Language>) => {
      const index = state.languages.findIndex(u => u.languageId === action.payload.languageId);
      if (index !== -1) {
        state.languages[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLanguagesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchLanguagesAsync.fulfilled, (state, action: PayloadAction<Language[]>) => {
        state.status = 'succeeded';
        state.languages = action.payload;
      })
      .addCase(fetchLanguagesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchLanguageById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLanguageById.fulfilled, (state, action: PayloadAction<Language>) => {
        state.status = 'succeeded';
        state.languages.push(action.payload);
      })
      .addCase(fetchLanguageById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addLanguageLocal, setLanguages, updateLanguageInState, setStatus, setError } = languagesSlice.actions;

export default languagesSlice.reducer;

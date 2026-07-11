import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getTheme, getThemes, addTheme } from '@/api/themeApi';
import { Theme } from '@/models/theme/theme';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { ThemeState } from '@/models/theme/ThemeState';
import { AxiosError } from 'axios';

export const fetchThemesAsync = createAsyncThunk('themes/getThemes', async () => {
  try {
    const response = await getThemes();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let themes: Theme[];
    try {
      themes = camelCaseKeys(decryptedData, { deep: true }) as unknown as Theme[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return themes;
  } catch (error) {
    console.error('Failed to fetch themes:', error);
    throw error;
  }
});

interface DecryptedThemeData {
  themeId: string;
  themeUuid: string;
  [key: string]: unknown;
}

export const fetchThemeById = createAsyncThunk(
  'themes/getTheme',
  async (themeUuid: string) => {
    try {
      const response = await getTheme(themeUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedThemeData>(encryptedData, iv);

      // Parse decrypted data as a Theme object
      const theme = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        themeId: decryptedData.id, // manually set the bookUuid
      } as Theme;

      return theme;
    } catch (error) {
      console.error('Failed to fetch theme by ID:', error);
      throw error;
    }
  }
);

export const createTheme = createAsyncThunk(
  'publishers/createTheme',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addTheme(payload);
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

// Initial state setup
const initialState: ThemeState = {
  themes: [],
  status: 'idle',
  error: null,
};

const themesSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    addThemeLocal: (state, action: PayloadAction<Theme>) => {
      state.themes.push(action.payload);
    },
    setThemes: (state, action: PayloadAction<Theme[]>) => {
      state.themes = action.payload;
    },
    setStatus: (state, action: PayloadAction<ThemeState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateThemeInState: (state, action: PayloadAction<Theme>) => {
      const index = state.themes.findIndex(u => u.themeId === action.payload.themeId);
      if (index !== -1) {
        state.themes[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchThemesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchThemesAsync.fulfilled, (state, action: PayloadAction<Theme[]>) => {
        state.status = 'succeeded';
        state.themes = action.payload;
      })
      .addCase(fetchThemesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchThemeById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThemeById.fulfilled, (state, action: PayloadAction<Theme>) => {
        state.status = 'succeeded';
        state.themes.push(action.payload);
      })
      .addCase(fetchThemeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addThemeLocal, setThemes, updateThemeInState, setStatus, setError } = themesSlice.actions;

export default themesSlice.reducer;

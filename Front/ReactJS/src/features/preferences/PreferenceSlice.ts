import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getPreference, addPreference, updatePreference } from '@/api/preferenceApi';
import { Preference } from '@/models/preference/preference';
import { PreferenceState } from '@/models/preference/PreferenceState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

interface DecryptedPreferenceData {
  preferenceId: string;
  preferenceUuid: string;
  [key: string]: unknown;
}

export const fetchPreferenceAsync = createAsyncThunk(
  'preferences/getPreference',
  async () => {
    try {
      const response = await getPreference();

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedPreferenceData>(encryptedData, iv);

      // Parse decrypted data as a Preference object
      const preference = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        preferenceId: decryptedData.id, // manually set the preferenceUuid
      } as Preference;

      return preference;
    } catch (error) {
      console.error('Failed to fetch preference by ID:', error);
      throw error;
    }
  }
);

export const createPreference = createAsyncThunk(
  'publishers/createPreference',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addPreference(payload);
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

type UpdatePreferenceParams = {
  preferenceUuid: string;
  payload: EncryptedPayload;
};

export const updatePreferenceAsync = createAsyncThunk(
  'preferences/updatePreference',
  async ({ preferenceUuid, payload }: UpdatePreferenceParams) => {
    try {
      await updatePreference(preferenceUuid, payload);
      
      return { preferenceUuid, decryped : decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update preference:', error);
      }
      // Throw error to handle it in UI
      throw error; 
    }
  }
);
// Initial state setup
const initialState: PreferenceState = {
  preference: null,
  status: 'idle',
  error: null,
};

const preferencesSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setPreference: (state, action: PayloadAction<Preference>) => {
      state.preference = action.payload;
    },
    setStatus: (state, action: PayloadAction<PreferenceState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPreferenceAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPreferenceAsync.fulfilled, (state, action: PayloadAction<Preference>) => {
        state.status = 'succeeded';
        state.preference = action.payload;
      })
      .addCase(fetchPreferenceAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      .addCase(createPreference.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preference = action.payload;
      })
      .addCase(createPreference.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      .addCase(updatePreferenceAsync.fulfilled, (state, action) => {
        const decrypted = camelCaseKeys(action.payload.decryped, { deep: true }) as unknown as Preference;
        state.preference = decrypted;
      });
  },
});

export const { setPreference, setStatus, setError } = preferencesSlice.actions;

export default preferencesSlice.reducer;


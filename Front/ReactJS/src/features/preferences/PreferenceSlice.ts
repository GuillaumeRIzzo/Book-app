import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getPreference, getPreferences, addPreference, updatePreference } from '@/api/preferenceApi';
import { Preference } from '@/models/preference/preference';
import { PreferenceState } from '@/models/preference/PreferenceState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';

export const fetchPreferencesAsync = createAsyncThunk('preferences/getPreferences', async () => {
  try {
    const response = await getPreferences();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let preferences: Preference[];
    try {
      preferences = camelCaseKeys(decryptedData, { deep: true }) as unknown as Preference[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return preferences;
  } catch (error) {
    console.error('Failed to fetch preferences:', error);
    throw error;
  }
});

export const fetchPreferenceById = createAsyncThunk(
  'preferences/getPreference',
  async (preferenceUuid: string) => {
    try {
      const response = await getPreference(preferenceUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload(encryptedData, iv);

      // Parse decrypted data as a Preference object
      const preference = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        preferenceId: (decryptedData as any).id, // manually set the preferenceUuid
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
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
    } catch (error: any) {
      console.error('Failed to update preference:', error);
      // Throw error to handle it in UI
      throw error; 
    }
  }
);
// Initial state setup
const initialState: PreferenceState = {
  preferences: [],
  status: 'idle',
  error: null,
};

const preferencesSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    addPreferenceLocal: (state, action: PayloadAction<Preference>) => {
      state.preferences.push(action.payload);
    },
    setPreferences: (state, action: PayloadAction<Preference[]>) => {
      state.preferences = action.payload;
    },
    setStatus: (state, action: PayloadAction<PreferenceState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updatePreferenceInState: (state, action: PayloadAction<Preference>) => {
      const index = state.preferences.findIndex(u => u.preferenceId === action.payload.preferenceId);
      if (index !== -1) {
        state.preferences[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPreferencesAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPreferencesAsync.fulfilled, (state, action: PayloadAction<Preference[]>) => {
        state.status = 'succeeded';
        state.preferences = action.payload;
      })
      .addCase(fetchPreferencesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchPreferenceById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPreferenceById.fulfilled, (state, action: PayloadAction<Preference>) => {
        state.status = 'succeeded';
        state.preferences.push(action.payload);
      })
      .addCase(fetchPreferenceById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Create
      .addCase(createPreference.pending, state => {
        state.status = 'loading';
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preferences.push(action.payload);
      })
      .addCase(createPreference.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      .addCase(updatePreferenceAsync.fulfilled, (state, action) => {
        const decrypted = camelCaseKeys(action.payload.decryped, { deep: true }) as unknown as Preference;
        const index = state.preferences.findIndex(p => p.preferenceUuid === action.payload.preferenceUuid);
        if (index !== -1) {
          state.preferences[index] = decrypted;
        } else {
          state.preferences.push(decrypted);
        }
      });
  },
});

export const { addPreferenceLocal, setPreferences, updatePreferenceInState, setStatus, setError } = preferencesSlice.actions;

export default preferencesSlice.reducer;

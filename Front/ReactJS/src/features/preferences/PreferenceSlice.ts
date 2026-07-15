import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getPreferenceByUser, getPreferences, addPreference, updatePreference } from '@/api/preferenceApi';
import { Preference } from '@/models/preference/preference';
import { PreferenceState } from '@/models/preference/PreferenceState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const fetchPreferencesAsync = createAsyncThunk('preference/getPreferences', async () => {
  try {
    const response = await getPreferences();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let preference: Preference[];
    try {
      preference = camelCaseKeys(decryptedData, { deep: true }) as unknown as Preference[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return preference;
  } catch (error) {
    console.error('Failed to fetch preference:', error);
    throw error;
  }
});

export const fetchUserPreference = createAsyncThunk(
  'preference/getUserPreference',
  async (userUuid: string) => {
    try {
      const response = await getPreferenceByUser(userUuid);

      const decryptedData = decryptPayload(
        response.data.encryptedData,
        response.data.iv
      );

      return camelCaseKeys(
        decryptedData,
        { deep: true }
      ) as unknown as Preference;

    } catch (error) {
      console.error(
        'Failed to fetch user preference:',
        error
      );
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
  'preference/updatePreference',
  async ({ preferenceUuid, payload }: UpdatePreferenceParams) => {
    try {
      await updatePreference(preferenceUuid, payload);

      return { preferenceUuid, decryped: decryptPayload(payload.encryptedData, payload.iv) };
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
    addPreferenceLocal: (state, action: PayloadAction<Preference | null>) => {
      state.preference = (action.payload);
    },
    setPreferences: (state, action: PayloadAction<Preference | null>) => {
      state.preference = action.payload;
    },
    setStatus: (state, action: PayloadAction<PreferenceState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updatePreferenceInState: (
      state,
      action: PayloadAction<Preference>
    ) => {
      state.preference = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      // .addCase(fetchPreferencesAsync.pending, state => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchPreferencesAsync.fulfilled, (state, action: PayloadAction<Preference>) => {
      //   state.status = 'succeeded';
      //   state.preference = action.payload;
      // })
      // .addCase(fetchPreferencesAsync.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchUserPreference.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPreference.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preference = (action.payload);
      })
      .addCase(fetchUserPreference.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Create
      .addCase(createPreference.pending, state => {
        state.status = 'loading';
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preference = (action.payload);
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

export const { addPreferenceLocal, setPreferences, updatePreferenceInState, setStatus, setError } = preferencesSlice.actions;

export default preferencesSlice.reducer;

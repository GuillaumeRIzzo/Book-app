import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getGender, getGenders, addGender, updateGender } from '@/api/genderApi';
import { Gender } from '@/models/gender/gender';
import { GenderState } from '@/models/gender/GenderState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const fetchGendersAsync = createAsyncThunk('genders/getGenders', async () => {
  try {
    const response = await getGenders();

    console.log(response);
    

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let genders: Gender[];
    try {
      genders = camelCaseKeys(decryptedData, { deep: true }) as unknown as Gender[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return genders;
  } catch (error) {
    console.error('Failed to fetch genders:', error);
    throw error;
  }
});

interface DecryptedGenderData {
  genderId: string;
  genderUuid: string;
  genderLabel: string;
  [key: string]: unknown;
}

export const fetchGenderById = createAsyncThunk(
  'genders/getGender',
  async (genderUuid: string) => {
    try {
      const response = await getGender(genderUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedGenderData>(encryptedData, iv);

      // Parse decrypted data as a Gender object
      const gender = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        genderId: decryptedData.id, // manually set the genderId
      } as Gender;

      return gender;
    } catch (error) {
      console.error('Failed to fetch gender by ID:', error);
      throw error;
    }
  }
);

export const createGender = createAsyncThunk(
  'publishers/createGender',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addGender(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
    }
  }
);

type UpdateGenderParams = {
  genderUuid: string;
  payload: EncryptedPayload;
};

export const updateGenderAsync = createAsyncThunk(
  'genders/updateGender',
  async ({ genderUuid, payload }: UpdateGenderParams) => {
    try {
      await updateGender(genderUuid, payload);
      
      return { genderUuid, decryped : decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update gender:', axiosError.response);
      }
      // Throw error to handle it in UI
      throw error; 
    }
  }
);
// Initial state setup
const initialState: GenderState = {
  genders: [],
  status: 'idle',
  error: null,
};

const gendersSlice = createSlice({
  name: 'gender',
  initialState,
  reducers: {
    addGenderLocal: (state, action: PayloadAction<Gender>) => {
      state.genders.push(action.payload);
    },
    setGenders: (state, action: PayloadAction<Gender[]>) => {
      state.genders = action.payload;
    },
    setStatus: (state, action: PayloadAction<GenderState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateGenderInState: (state, action: PayloadAction<Gender>) => {
      const index = state.genders.findIndex(u => u.genderId === action.payload.genderId);
      if (index !== -1) {
        state.genders[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGendersAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchGendersAsync.fulfilled, (state, action: PayloadAction<Gender[]>) => {
        state.status = 'succeeded';
        state.genders = action.payload;
      })
      .addCase(fetchGendersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchGenderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenderById.fulfilled, (state, action: PayloadAction<Gender>) => {
        state.status = 'succeeded';
        state.genders.push(action.payload);
      })
      .addCase(fetchGenderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addGenderLocal, setGenders, updateGenderInState, setStatus, setError } = gendersSlice.actions;

export default gendersSlice.reducer;

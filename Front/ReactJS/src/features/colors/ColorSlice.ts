import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getColor, getColors, addColor, updateColor } from '@/api/colorApi';
import { Color } from '@/models/color/color';
import { ColorState } from '@/models/color/ColorState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const fetchColorsAsync = createAsyncThunk('colors/getColors', async () => {
  try {
    const response = await getColors();

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let colors: Color[];
    try {
      colors = camelCaseKeys(decryptedData, { deep: true }) as unknown as Color[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return colors;
  } catch (error) {
    console.error('Failed to fetch colors:', error);
    throw error;
  }
});

interface DecryptedColorData {
  colorId: string;
  colorUuid: string;
  colorName: string;
  [key: string]: unknown;
}

export const fetchColorById = createAsyncThunk(
  'colors/getColor',
  async (colorUuid: string) => {
    try {
      const response = await getColor(colorUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedColorData>(encryptedData, iv);

      // Parse decrypted data as a Color object
      const color = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        colorId: decryptedData.id, // manually set the colorUuid
      } as Color;

      return color;
    } catch (error) {
      console.error('Failed to fetch color by ID:', error);
      throw error;
    }
  }
);

export const createColor = createAsyncThunk(
  'publishers/createColor',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addColor(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
    }
  }
);

type UpdateColorParams = {
  colorUuid: string;
  payload: EncryptedPayload;
};

export const updateColorAsync = createAsyncThunk(
  'colors/updateColor',
  async ({ colorUuid, payload }: UpdateColorParams) => {
    try {
      await updateColor(colorUuid, payload);
      
      return { colorUuid, decryped : decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update color:', axiosError.response);
      }
      // Throw error to handle it in UI
      throw error; 
    }
  }
);
// Initial state setup
const initialState: ColorState = {
  colors: [],
  status: 'idle',
  error: null,
};

const colorsSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    addColorLocal: (state, action: PayloadAction<Color>) => {
      state.colors.push(action.payload);
    },
    setColors: (state, action: PayloadAction<Color[]>) => {
      state.colors = action.payload;
    },
    setStatus: (state, action: PayloadAction<ColorState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateColorInState: (state, action: PayloadAction<Color>) => {
      const index = state.colors.findIndex(u => u.colorId === action.payload.colorId);
      if (index !== -1) {
        state.colors[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchColorsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchColorsAsync.fulfilled, (state, action: PayloadAction<Color[]>) => {
        state.status = 'succeeded';
        state.colors = action.payload;
      })
      .addCase(fetchColorsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchColorById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchColorById.fulfilled, (state, action: PayloadAction<Color>) => {
        state.status = 'succeeded';
        state.colors.push(action.payload);
      })
      .addCase(fetchColorById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addColorLocal, setColors, updateColorInState, setStatus, setError } = colorsSlice.actions;

export default colorsSlice.reducer;

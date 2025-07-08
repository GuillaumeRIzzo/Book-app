import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import camelCaseKeys from 'camelcase-keys';

import { getTag, getTags, addTag, updateTag } from '@/api/tagApi';
import { Tag } from '@/models/tag/tag';
import { TagState } from '@/models/tag/TagState';
import { decryptPayload, EncryptedPayload } from '@/utils/encryptUtils';
import { AxiosError } from 'axios';

export const fetchTagsAsync = createAsyncThunk('tags/getTags', async () => {
  try {
    const response = await getTags();

    console.log(response);
    

    const encryptedData = response.data.encryptedData;
    const iv = response.data.iv;

    const decryptedData = decryptPayload(encryptedData, iv);

    let tags: Tag[];
    try {
      tags = camelCaseKeys(decryptedData, { deep: true }) as unknown as Tag[];

    } catch (error) {
      console.error('Failed to parse decrypted data:', decryptedData);
      throw new Error('Decrypted data is not valid JSON');
    }

    return tags;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    throw error;
  }
});

interface DecryptedTagData {
  tagId: string;
  tagUuid: string;
  tagLabel: string;
  [key: string]: unknown;
}

export const fetchTagById = createAsyncThunk(
  'tags/getTag',
  async (tagUuid: string) => {
    try {
      const response = await getTag(tagUuid);

      const encryptedData = response.data.encryptedData as string;
      const iv = response.data.iv as string;

      const decryptedData = decryptPayload<DecryptedTagData>(encryptedData, iv);

      // Parse decrypted data as a Tag object
      const tag = {
        ...camelCaseKeys(decryptedData, { deep: true }),
        tagId: decryptedData.id, // manually set the tagId
      } as Tag;

      return tag;
    } catch (error) {
      console.error('Failed to fetch tag by ID:', error);
      throw error;
    }
  }
);

export const createTag = createAsyncThunk(
  'publishers/createTag',
  async (payload: EncryptedPayload, { rejectWithValue }) => {
    try {
      const response = await addTag(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
    }
  }
);

type UpdateTagParams = {
  tagUuid: string;
  payload: EncryptedPayload;
};

export const updateTagAsync = createAsyncThunk(
  'tags/updateTag',
  async ({ tagUuid, payload }: UpdateTagParams) => {
    try {
      await updateTag(tagUuid, payload);
      
      return { tagUuid, decryped : decryptPayload(payload.encryptedData, payload.iv) };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Failed to update tag:', axiosError.response);
      }
      // Throw error to handle it in UI
      throw error; 
    }
  }
);
// Initial state setup
const initialState: TagState = {
  tags: [],
  status: 'idle',
  error: null,
};

const tagsSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    addTagLocal: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
    setStatus: (state, action: PayloadAction<TagState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateTagInState: (state, action: PayloadAction<Tag>) => {
      const index = state.tags.findIndex(u => u.tagId === action.payload.tagId);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTagsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTagsAsync.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTagsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchTagById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTagById.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.status = 'succeeded';
        state.tags.push(action.payload);
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addTagLocal, setTags, updateTagInState, setStatus, setError } = tagsSlice.actions;

export default tagsSlice.reducer;

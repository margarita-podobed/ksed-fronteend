import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchDocument = createAsyncThunk(
  'document/fetchById',
  async ({ ticket, t, nodeRef }, thunkAPI) => {
    const url = `/alfresco/service/mobile2/document`
      + `?alf_ticket=${encodeURIComponent(ticket)}`
      + `&t=${encodeURIComponent(t)}`
      + `&unix=true`
      + `&nodeRef=${encodeURIComponent(nodeRef)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept-Language': 'ru'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      const errorText = await response.text();
      return thunkAPI.rejectWithValue(errorText);
    }

    const json = await response.json();
    return json;
  }
);

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    data: null,
    status: 'idle',
    error: null
  },
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDocument.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export default documentSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDocument = createAsyncThunk(
  'document/fetchById',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const ticket = 'TICKET_5b5c5a67bdd2cf4fb24ae3cbb65dde9497ccbfb8'
    //state.auth.ticket;
    const t = '1751359116169'
    const nodeRef = 'workspace://SpacesStore/bac81136-db24-45b8-8f5d-f4df7012eaae'
    if (!ticket) {
      return thunkAPI.rejectWithValue('Не найден ticket в авторизации');
    }

    const url = `/alfresco/service/mobile2/document` +
      `?alf_ticket=${encodeURIComponent(ticket)}` +
      `&t=${encodeURIComponent(t)}` +
      `&unix=true` +
      `&nodeRef=${encodeURIComponent(nodeRef)}`;

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
    clearDocument(state) {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
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

export const { clearDocument } = documentSlice.actions;
export default documentSlice.reducer;

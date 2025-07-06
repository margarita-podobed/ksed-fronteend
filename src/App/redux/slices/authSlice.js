import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const login = createAsyncThunk(
  'auth/login',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        '/alfresco/s/api/login?',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'bykovvv',
            password: 'Qwer1234'
          }),
          redirect: 'follow'
        }
      );
      if (!response.ok) {
        const text = await response.text();
        return thunkAPI.rejectWithValue(text);
      }
      // читаем JSON, достаём data.ticket
      const json = await response.json();
      const ticket = json.data?.ticket;
      if (!ticket) {
        return thunkAPI.rejectWithValue('В ответе нет data.ticket');
      }
      return ticket;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.toString());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ticket: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout(state) {
      state.ticket = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ticket = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

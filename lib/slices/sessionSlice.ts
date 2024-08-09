import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../apolloClient';
import { FETCH_LAST_TEN_SESSIONS, FETCH_ACTIVE_SESSION, CREATE_SESSION, 
         CONTINUE_SESSION, END_SESSION } from '../mutations/session';

export interface CreateSessionInput {
  decks: number;
  numSpots: number;
  penetration: number;
  sixFive: boolean;
  stand17: boolean;
}

export const createSession = createAsyncThunk(
  'session/createSession',
  async (input: CreateSessionInput, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_SESSION,
        variables: { input },
      });
      if (data.createSession.errors && data.createSession.errors.length > 0) {
        return rejectWithValue(data.createSession.errors);
      }
      return data.createSession.session;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const endSession = createAsyncThunk(
  'session/endSession',
  async (input: {id: string}, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: END_SESSION,
        variables: { id },
      });
      if (data.endSession.errors && data.endSession.errors.length > 0) {
        console.error('Failed to end session:', data.endSession.errors);
        // Handle errors (e.g., show to user)
      } else {
        // Session ended successfully
        console.log('Session ended:', data.endSession.session);
        // Update your local state or trigger a refetch of sessions
      }
    } catch (error) {
      console.error('Error ending session:', error);
      // Handle error (e.g., show to user)
    }
  }
);

export const fetchLastTenSessions = createAsyncThunk(
  'session/fetchLastTenSessions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: FETCH_LAST_TEN_SESSIONS,
      });
      return data.lastTenSessions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActiveSession = createAsyncThunk(
  'session/fetchActiveSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: FETCH_ACTIVE_SESSION,
      });
      return data.activeSession;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const continueSession = createAsyncThunk(
  'session/continueSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: CONTINUE_SESSION,
        variables: { sessionId },
      });
      return data.continueSession;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    sessions: [],
    activeSession: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastTenSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLastTenSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchLastTenSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSession = action.payload;
      })
      .addCase(fetchActiveSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      })
      .addCase(endSession.fulfilled, (state, action) => {
        state.activeSession = null;
      })
      .addCase(continueSession.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      });
  },
});

export default sessionSlice.reducer;
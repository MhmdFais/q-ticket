import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsersAPI,
  getUserByIdAPI,
  updateUserStatusAPI,
  updateUserRoleAPI,
} from "../../api/user.api";

const extractError = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  error.message ||
  "Something went wrong";

export const getAllUsersThunk = createAsyncThunk(
  "users/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllUsersAPI(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const getUserByIdThunk = createAsyncThunk(
  "users/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserByIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateUserStatusThunk = createAsyncThunk(
  "users/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUserStatusAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

export const updateUserRoleThunk = createAsyncThunk(
  "users/updateRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateUserRoleAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAll
      .addCase(getAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getById
      .addCase(getUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStatus
      .addCase(updateUserStatusThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index !== -1) state.users[index] = action.payload.data;
      })
      .addCase(updateUserStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateRole
      .addCase(updateUserRoleThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index !== -1) state.users[index] = action.payload.data;
      })
      .addCase(updateUserRoleThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsersAPI,
  getUserByIdAPI,
  updateUserStatusAPI,
  updateUserRoleAPI,
} from "../../api/user.api";

export const getAllUsersThunk = createAsyncThunk(
  "users/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllUsersAPI(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user role",
      );
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
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index !== -1) state.users[index] = action.payload.data;
      })

      // updateRole
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index !== -1) state.users[index] = action.payload.data;
      });
  },
});

export const { clearCurrentUser, clearError } = userSlice.actions;
export default userSlice.reducer;

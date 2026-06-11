import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStatsAPI } from "../../api/dashboard.api";

const extractError = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  error.message ||
  "Something went wrong";

export const getDashboardStatsThunk = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStatsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTicketAPI,
  getAllTicketsAPI,
  getTicketByIdAPI,
  updateTicketAPI,
  updateTicketStatusAPI,
  assignTicketAPI,
  addCommentAPI,
  deleteTicketAPI,
} from "../../api/ticket.api";

export const createTicketThunk = createAsyncThunk(
  "tickets/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createTicketAPI(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create ticket",
      );
    }
  },
);

export const getAllTicketsThunk = createAsyncThunk(
  "tickets/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllTicketsAPI(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tickets",
      );
    }
  },
);

export const getTicketByIdThunk = createAsyncThunk(
  "tickets/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTicketByIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ticket",
      );
    }
  },
);

export const updateTicketThunk = createAsyncThunk(
  "tickets/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateTicketAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update ticket",
      );
    }
  },
);

export const updateTicketStatusThunk = createAsyncThunk(
  "tickets/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateTicketStatusAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
  },
);

export const assignTicketThunk = createAsyncThunk(
  "tickets/assign",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await assignTicketAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign ticket",
      );
    }
  },
);

export const addCommentThunk = createAsyncThunk(
  "tickets/addComment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await addCommentAPI(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

export const deleteTicketThunk = createAsyncThunk(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTicketAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete ticket",
      );
    }
  },
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    currentTicket: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createTicketThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicketThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload.data);
      })
      .addCase(createTicketThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAll
      .addCase(getAllTicketsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTicketsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data.tickets;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllTicketsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getById
      .addCase(getTicketByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload.data;
      })
      .addCase(getTicketByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update
      .addCase(updateTicketThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload.data;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload.data._id,
        );
        if (index !== -1) state.tickets[index] = action.payload.data;
      })

      // updateStatus
      .addCase(updateTicketStatusThunk.fulfilled, (state, action) => {
        state.currentTicket = action.payload.data;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload.data._id,
        );
        if (index !== -1) state.tickets[index] = action.payload.data;
      })

      // assign
      .addCase(assignTicketThunk.fulfilled, (state, action) => {
        state.currentTicket = action.payload.data;
        const index = state.tickets.findIndex(
          (t) => t._id === action.payload.data._id,
        );
        if (index !== -1) state.tickets[index] = action.payload.data;
      })

      // addComment
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        state.currentTicket = action.payload.data;
      })

      // delete
      .addCase(deleteTicketThunk.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearCurrentTicket, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;

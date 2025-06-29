import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingsAPI } from "../services/api";
import { toast } from "react-hot-toast";

// Initial state
const initialState = {
  // All bookings
  bookings: {
    list: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    total: 0,
  },

  // Current booking detail
  currentBooking: {
    data: null,
    loading: false,
    error: null,
    updating: false,
  },

  // Dashboard stats
  stats: {
    data: {
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      totalEarnings: 0,
      averageRating: 0,
      responseTime: 0,
      completionRate: 0,
    },
    loading: false,
    error: null,
  },

  // Filters
  filters: {
    status: "all", // all, requested, accepted, in_progress, completed, cancelled
    dateRange: "all", // all, today, week, month, custom
    sortBy: "created_at",
    orderBy: "desc",
    search: "",
  },

  // Create booking state
  createBooking: {
    loading: false,
    error: null,
    success: false,
  },

  // File upload state
  fileUpload: {
    loading: false,
    progress: 0,
    error: null,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { bookings } = getState();
      const { page = 1, loadMore = false, ...otherParams } = params;

      const requestParams = {
        page,
        limit: 20,
        ...bookings.filters,
        ...otherParams,
      };

      const response = await bookingsAPI.getBookings(requestParams);

      return {
        data: response.data,
        page,
        loadMore,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bookinglarni olishda xato"
      );
    }
  }
);

export const fetchBookingDetail = createAsyncThunk(
  "bookings/fetchBookingDetail",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getBookingDetail(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Booking ma'lumotlarini olishda xato"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Booking yaratishda xato"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status, data = {} }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.updateBookingStatus(bookingId, {
        status,
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Booking holatini yangilashda xato"
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ bookingId, data }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.updateBooking(bookingId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bookingni yangilashda xato"
      );
    }
  }
);

export const addTimeEntry = createAsyncThunk(
  "bookings/addTimeEntry",
  async ({ bookingId, timeData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.addTimeEntry(bookingId, timeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Vaqt qo'shishda xato"
      );
    }
  }
);

export const addTask = createAsyncThunk(
  "bookings/addTask",
  async ({ bookingId, taskData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.addTask(bookingId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Vazifa qo'shishda xato"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "bookings/updateTask",
  async ({ bookingId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.updateTask(
        bookingId,
        taskId,
        taskData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Vazifani yangilashda xato"
      );
    }
  }
);

export const uploadBookingFiles = createAsyncThunk(
  "bookings/uploadFiles",
  async ({ bookingId, files, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await bookingsAPI.uploadFiles(bookingId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fayllarni yuklashda xato"
      );
    }
  }
);

export const addCommunication = createAsyncThunk(
  "bookings/addCommunication",
  async ({ bookingId, communicationData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.addCommunication(
        bookingId,
        communicationData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Muloqot qo'shishda xato"
      );
    }
  }
);

export const addDispute = createAsyncThunk(
  "bookings/addDispute",
  async ({ bookingId, disputeData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.addDispute(bookingId, disputeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Nizo qo'shishda xato"
      );
    }
  }
);

export const addRating = createAsyncThunk(
  "bookings/addRating",
  async ({ bookingId, ratingData }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.addRating(bookingId, ratingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Baholashda xato"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "bookings/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Statistikani olishda xato"
      );
    }
  }
);

// Bookings slice
const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.bookings.page = 1;
      state.bookings.hasMore = true;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.bookings.page = 1;
      state.bookings.hasMore = true;
    },

    // Booking list actions
    clearBookings: (state) => {
      state.bookings.list = [];
      state.bookings.page = 1;
      state.bookings.hasMore = true;
      state.bookings.total = 0;
    },

    // Current booking actions
    clearCurrentBooking: (state) => {
      state.currentBooking = initialState.currentBooking;
    },

    // Create booking actions
    resetCreateBooking: (state) => {
      state.createBooking = initialState.createBooking;
    },

    // Error handling
    clearErrors: (state) => {
      state.bookings.error = null;
      state.currentBooking.error = null;
      state.stats.error = null;
      state.createBooking.error = null;
      state.fileUpload.error = null;
    },

    // Real-time updates
    updateBookingInList: (state, action) => {
      const { bookingId, updates } = action.payload;
      const bookingIndex = state.bookings.list.findIndex(
        (booking) => booking.id === bookingId
      );

      if (bookingIndex !== -1) {
        state.bookings.list[bookingIndex] = {
          ...state.bookings.list[bookingIndex],
          ...updates,
        };
      }

      // Update current booking if it matches
      if (state.currentBooking.data?.id === bookingId) {
        state.currentBooking.data = {
          ...state.currentBooking.data,
          ...updates,
        };
      }
    },

    // Add new booking to list (for real-time updates)
    addBookingToList: (state, action) => {
      const newBooking = action.payload;
      state.bookings.list.unshift(newBooking);
      state.bookings.total += 1;
    },

    // Remove booking from list
    removeBookingFromList: (state, action) => {
      const bookingId = action.payload;
      state.bookings.list = state.bookings.list.filter(
        (booking) => booking.id !== bookingId
      );
      state.bookings.total = Math.max(0, state.bookings.total - 1);
    },

    // Update file upload progress
    setFileUploadProgress: (state, action) => {
      state.fileUpload.progress = action.payload;
    },

    // Update stats in real-time
    updateStats: (state, action) => {
      state.stats.data = { ...state.stats.data, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state, action) => {
        state.bookings.loading = true;
        state.bookings.error = null;

        // If it's not a load more request, clear current list
        if (!action.meta.arg?.loadMore) {
          state.bookings.list = [];
        }
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings.loading = false;
        const { data, page, loadMore } = action.payload;

        if (loadMore) {
          // Append new bookings
          state.bookings.list.push(...(data.bookings || data));
        } else {
          // Replace bookings
          state.bookings.list = data.bookings || data;
        }

        state.bookings.page = page;
        state.bookings.total = data.pagination?.total || data.length;
        state.bookings.hasMore =
          data.pagination?.current < data.pagination?.pages || false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.bookings.loading = false;
        state.bookings.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch Booking Detail
      .addCase(fetchBookingDetail.pending, (state) => {
        state.currentBooking.loading = true;
        state.currentBooking.error = null;
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.currentBooking.loading = false;
        state.currentBooking.data = action.payload.booking || action.payload;
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.currentBooking.loading = false;
        state.currentBooking.error = action.payload;
        toast.error(action.payload);
      })

      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.createBooking.loading = true;
        state.createBooking.error = null;
        state.createBooking.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createBooking.loading = false;
        state.createBooking.success = true;

        // Add new booking to the beginning of the list
        const newBooking = action.payload.booking || action.payload;
        state.bookings.list.unshift(newBooking);
        state.bookings.total += 1;

        toast.success("Booking muvaffaqiyatli yaratildi");
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createBooking.loading = false;
        state.createBooking.error = action.payload;
        toast.error(action.payload);
      })

      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.currentBooking.updating = true;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.currentBooking.updating = false;
        const updatedBooking = action.payload.booking || action.payload;

        // Update current booking
        if (state.currentBooking.data) {
          state.currentBooking.data = {
            ...state.currentBooking.data,
            ...updatedBooking,
          };
        }

        // Update in bookings list
        const bookingIndex = state.bookings.list.findIndex(
          (booking) => booking.id === updatedBooking.id
        );
        if (bookingIndex !== -1) {
          state.bookings.list[bookingIndex] = {
            ...state.bookings.list[bookingIndex],
            ...updatedBooking,
          };
        }

        toast.success("Booking holati yangilandi");
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.currentBooking.updating = false;
        toast.error(action.payload);
      })

      // Update Booking
      .addCase(updateBooking.pending, (state) => {
        state.currentBooking.updating = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.currentBooking.updating = false;
        const updatedBooking = action.payload.booking || action.payload;

        // Update current booking
        if (state.currentBooking.data) {
          state.currentBooking.data = {
            ...state.currentBooking.data,
            ...updatedBooking,
          };
        }

        // Update in bookings list
        const bookingIndex = state.bookings.list.findIndex(
          (booking) => booking.id === updatedBooking.id
        );
        if (bookingIndex !== -1) {
          state.bookings.list[bookingIndex] = {
            ...state.bookings.list[bookingIndex],
            ...updatedBooking,
          };
        }

        toast.success("Booking yangilandi");
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.currentBooking.updating = false;
        toast.error(action.payload);
      })

      // Add Time Entry
      .addCase(addTimeEntry.fulfilled, (state, action) => {
        const timeEntry = action.payload.timeEntry || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.timeEntries =
            state.currentBooking.data.timeEntries || [];
          state.currentBooking.data.timeEntries.push(timeEntry);
        }

        toast.success("Vaqt qo'shildi");
      })
      .addCase(addTimeEntry.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        const task = action.payload.task || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.tasks =
            state.currentBooking.data.tasks || [];
          state.currentBooking.data.tasks.push(task);
        }

        toast.success("Vazifa qo'shildi");
      })
      .addCase(addTask.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.task || action.payload;

        if (state.currentBooking.data?.tasks) {
          const taskIndex = state.currentBooking.data.tasks.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (taskIndex !== -1) {
            state.currentBooking.data.tasks[taskIndex] = updatedTask;
          }
        }

        toast.success("Vazifa yangilandi");
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Upload Files
      .addCase(uploadBookingFiles.pending, (state) => {
        state.fileUpload.loading = true;
        state.fileUpload.error = null;
        state.fileUpload.progress = 0;
      })
      .addCase(uploadBookingFiles.fulfilled, (state, action) => {
        state.fileUpload.loading = false;
        state.fileUpload.progress = 100;

        const files = action.payload.files || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.files =
            state.currentBooking.data.files || [];
          state.currentBooking.data.files.push(...files);
        }

        toast.success("Fayllar yuklandi");
      })
      .addCase(uploadBookingFiles.rejected, (state, action) => {
        state.fileUpload.loading = false;
        state.fileUpload.error = action.payload;
        toast.error(action.payload);
      })

      // Add Communication
      .addCase(addCommunication.fulfilled, (state, action) => {
        const communication = action.payload.communication || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.communications =
            state.currentBooking.data.communications || [];
          state.currentBooking.data.communications.push(communication);
        }

        toast.success("Muloqot qo'shildi");
      })
      .addCase(addCommunication.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Add Dispute
      .addCase(addDispute.fulfilled, (state, action) => {
        const dispute = action.payload.dispute || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.dispute = dispute;
          state.currentBooking.data.status = "disputed";
        }

        toast.success("Nizo qo'shildi");
      })
      .addCase(addDispute.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Add Rating
      .addCase(addRating.fulfilled, (state, action) => {
        const rating = action.payload.rating || action.payload;

        if (state.currentBooking.data) {
          state.currentBooking.data.rating = rating;
        }

        // Update in bookings list
        const bookingIndex = state.bookings.list.findIndex(
          (booking) => booking.id === state.currentBooking.data?.id
        );
        if (bookingIndex !== -1) {
          state.bookings.list[bookingIndex].rating = rating;
        }

        toast.success("Baholash qo'shildi");
      })
      .addCase(addRating.rejected, (state, action) => {
        toast.error(action.payload);
      })

      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.data = action.payload.stats || action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      });
  },
});

// Actions
export const {
  setFilters,
  resetFilters,
  clearBookings,
  clearCurrentBooking,
  resetCreateBooking,
  clearErrors,
  updateBookingInList,
  addBookingToList,
  removeBookingFromList,
  setFileUploadProgress,
  updateStats,
} = bookingsSlice.actions;

// Selectors
export const selectBookings = (state) => state.bookings.bookings.list;
export const selectBookingsLoading = (state) => state.bookings.bookings.loading;
export const selectBookingsError = (state) => state.bookings.bookings.error;
export const selectBookingsHasMore = (state) => state.bookings.bookings.hasMore;
export const selectBookingsTotal = (state) => state.bookings.bookings.total;

export const selectCurrentBooking = (state) =>
  state.bookings.currentBooking.data;
export const selectCurrentBookingLoading = (state) =>
  state.bookings.currentBooking.loading;
export const selectCurrentBookingError = (state) =>
  state.bookings.currentBooking.error;
export const selectCurrentBookingUpdating = (state) =>
  state.bookings.currentBooking.updating;

export const selectBookingStats = (state) => state.bookings.stats.data;
export const selectBookingStatsLoading = (state) =>
  state.bookings.stats.loading;
export const selectBookingStatsError = (state) => state.bookings.stats.error;

export const selectBookingFilters = (state) => state.bookings.filters;

export const selectCreateBookingState = (state) => state.bookings.createBooking;
export const selectFileUploadState = (state) => state.bookings.fileUpload;

// Complex selectors
export const selectBookingsByStatus = (state) => {
  const bookings = state.bookings.bookings.list;
  return {
    all: bookings,
    requested: bookings.filter((booking) => booking.status === "requested"),
    accepted: bookings.filter((booking) => booking.status === "accepted"),
    in_progress: bookings.filter((booking) => booking.status === "in_progress"),
    completed: bookings.filter((booking) => booking.status === "completed"),
    cancelled: bookings.filter((booking) => booking.status === "cancelled"),
    disputed: bookings.filter((booking) => booking.status === "disputed"),
  };
};

export const selectBookingById = (bookingId) => (state) => {
  return state.bookings.bookings.list.find(
    (booking) => booking.id === bookingId
  );
};

export const selectActiveBookings = (state) => {
  return state.bookings.bookings.list.filter((booking) =>
    ["requested", "accepted", "in_progress"].includes(booking.status)
  );
};

export const selectRecentBookings = (state) => {
  return state.bookings.bookings.list.slice(0, 5);
};

export const selectIsAnyBookingLoading = (state) => {
  return (
    state.bookings.bookings.loading ||
    state.bookings.currentBooking.loading ||
    state.bookings.currentBooking.updating ||
    state.bookings.createBooking.loading ||
    state.bookings.fileUpload.loading ||
    state.bookings.stats.loading
  );
};

export default bookingsSlice.reducer;

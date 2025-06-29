import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";
import { STORAGE_KEYS } from "../utils/constants";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "../utils/helpers";
import { toast } from "react-hot-toast";

// Initial state
const initialState = {
  user: null,
  token: getLocalStorage(STORAGE_KEYS.AUTH_TOKEN),
  refreshToken: getLocalStorage(STORAGE_KEYS.REFRESH_TOKEN),
  isAuthenticated: !!getLocalStorage(STORAGE_KEYS.AUTH_TOKEN),
  loading: false,
  error: null,
  verificationStep: null, // 'phone', 'code', 'completed'
  tempUserId: null,
};

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Ro'yxatdan o'tishda xato";
      return rejectWithValue(message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async ({ userId, code }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verify({ userId, code });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Tasdiqlash kodida xato";
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (phone, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ phone });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Tizimga kirishda xato";
      return rejectWithValue(message);
    }
  }
);

export const loginVerify = createAsyncThunk(
  "auth/loginVerify",
  async ({ userId, code }, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginVerify({ userId, code });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Tasdiqlash kodida xato";
      return rejectWithValue(message);
    }
  }
);

export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await authAPI.resendCode({ userId });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Kod yuborishda xato";
      return rejectWithValue(message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        return rejectWithValue("Token mavjud emas");
      }

      // Here you would typically validate the token with the server
      // For now, we'll just check if user data exists in localStorage
      const userData = getLocalStorage(STORAGE_KEYS.USER_DATA);
      if (userData) {
        return { user: userData, token };
      }

      return rejectWithValue("Foydalanuvchi ma'lumotlari topilmadi");
    } catch (error) {
      return rejectWithValue("Autentifikatsiya tekshirishda xato");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      // Even if server request fails, we should still logout locally
      return true;
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVerificationStep: (state, action) => {
      state.verificationStep = action.payload;
    },
    setTempUserId: (state, action) => {
      state.tempUserId = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      setLocalStorage(STORAGE_KEYS.USER_DATA, state.user);
    },
    refreshAuthToken: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
      setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.tempUserId = action.payload.userId;
        state.verificationStep = "code";
        toast.success("Tasdiqlash kodi yuborildi");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Verify Code
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.verificationStep = "completed";
        state.tempUserId = null;

        // Save to localStorage
        setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
        setLocalStorage(
          STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.refreshToken
        );
        setLocalStorage(STORAGE_KEYS.USER_DATA, action.payload.user);

        toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.tempUserId = action.payload.userId;
        state.verificationStep = "code";
        toast.success("Tasdiqlash kodi yuborildi");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Login Verify
      .addCase(loginVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.verificationStep = "completed";
        state.tempUserId = null;

        // Save to localStorage
        setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
        setLocalStorage(
          STORAGE_KEYS.REFRESH_TOKEN,
          action.payload.refreshToken
        );
        setLocalStorage(STORAGE_KEYS.USER_DATA, action.payload.user);

        toast.success(`Xush kelibsiz, ${action.payload.user.name}!`);
      })
      .addCase(loginVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Resend Code
      .addCase(resendCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendCode.fulfilled, (state) => {
        state.loading = false;
        toast.success("Tasdiqlash kodi qayta yuborildi");
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        // Clear localStorage
        removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.USER_DATA);
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.verificationStep = null;
        state.tempUserId = null;
        state.error = null;

        // Clear localStorage
        removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.USER_DATA);

        toast.success("Muvaffaqiyatli chiqdingiz");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        // Still logout locally even if server request fails
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.verificationStep = null;
        state.tempUserId = null;

        // Clear localStorage
        removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.USER_DATA);
      });
  },
});

// Actions
export const {
  clearError,
  setVerificationStep,
  setTempUserId,
  updateUser,
  refreshAuthToken,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectVerificationStep = (state) => state.auth.verificationStep;
export const selectTempUserId = (state) => state.auth.tempUserId;

export default authSlice.reducer;

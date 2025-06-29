import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from "../utils/constants";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "../utils/helpers";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = getLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.MODE === "development") {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(
        `API Call: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              try {
                const response = await refreshAuthToken(refreshToken);
                const newToken = response.data.token;

                setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);
              } catch (refreshError) {
                // Refresh failed, redirect to login
                handleLogout();
                return Promise.reject(refreshError);
              }
            } else {
              handleLogout();
            }
          }
          break;

        case 403:
          toast.error(data.message || ERROR_MESSAGES.ACCESS_DENIED);
          break;

        case 404:
          toast.error(data.message || ERROR_MESSAGES.NOT_FOUND);
          break;

        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => {
              toast.error(err.message || err.msg);
            });
          } else {
            toast.error(data.message || ERROR_MESSAGES.VALIDATION_ERROR);
          }
          break;

        case 429:
          toast.error("Juda ko'p so'rov yuborildi. Biroz kuting.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
          break;

        default:
          toast.error(data.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } else if (error.request) {
      // Network error
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Other errors
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
    }

    return Promise.reject(error);
  }
);

// Auth token refresh
const refreshAuthToken = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  return response;
};

// Handle logout
const handleLogout = () => {
  removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
  removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
  removeLocalStorage(STORAGE_KEYS.USER_DATA);

  // Redirect to login page
  window.location.href = "/login";
};

// API Methods
export const apiClient = {
  // Generic methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // File upload method
  upload: (url, formData, onUploadProgress = null) => {
    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  // Download method
  download: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);

      return response;
    } catch (error) {
      toast.error("Faylni yuklashda xato yuz berdi");
      throw error;
    }
  },
};

// Auth API
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  verify: (data) => apiClient.post("/auth/verify", data),
  login: (data) => apiClient.post("/auth/login", data),
  loginVerify: (data) => apiClient.post("/auth/login/verify", data),
  resendCode: (data) => apiClient.post("/auth/resend-code", data),
  logout: () => apiClient.post("/auth/logout"),
  refreshToken: (refreshToken) =>
    apiClient.post("/auth/refresh", { refreshToken }),
};

// Users API
export const usersAPI = {
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (data) => apiClient.put("/users/profile", data),
  uploadProfileImage: (formData, onProgress) =>
    apiClient.upload("/users/profile/image", formData, onProgress),
  uploadCoverImage: (formData, onProgress) =>
    apiClient.upload("/users/profile/cover", formData, onProgress),
  uploadGallery: (formData, onProgress) =>
    apiClient.upload("/users/profile/gallery", formData, onProgress),
  addCategory: (data) => apiClient.post("/users/categories", data),
  addCertificate: (formData) =>
    apiClient.upload("/users/certificates", formData),
  addExperience: (data) => apiClient.post("/users/experience", data),
  addEducation: (data) => apiClient.post("/users/education", data),
  addService: (data) => apiClient.post("/users/services", data),
  updateAvailability: (data) => apiClient.put("/users/availability", data),
  updateStatus: (data) => apiClient.put("/users/status", data),
  updatePreferences: (data) => apiClient.put("/users/preferences", data),
  searchSpecialists: (params) =>
    apiClient.get("/users/specialists/search", { params }),
  getSpecialistDetail: (id) => apiClient.get(`/users/specialists/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params = {}) => apiClient.get("/categories", { params }),
  getCategoryDetail: (slug) => apiClient.get(`/categories/${slug}`),
  getSubcategories: (slug) =>
    apiClient.get(`/categories/${slug}/subcategories`),
  searchCategories: (query) => apiClient.get(`/categories/search/${query}`),
  getTrendingCategories: () => apiClient.get("/categories/special/trending"),
  getFeaturedCategories: () => apiClient.get("/categories/special/featured"),
  getPopularCategories: () => apiClient.get("/categories/special/popular"),
  getCategoryFields: (slug) => apiClient.get(`/categories/${slug}/fields`),
  validateCategoryData: (slug, data) =>
    apiClient.post(`/categories/${slug}/validate-data`, { data }),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params = {}) => apiClient.get("/bookings", { params }),
  getBookingDetail: (id) => apiClient.get(`/bookings/${id}`),
  createBooking: (data) => apiClient.post("/bookings", data),
  updateBookingStatus: (id, data) =>
    apiClient.put(`/bookings/${id}/status`, data),
  updateBooking: (id, data) => apiClient.put(`/bookings/${id}`, data),
  addTimeEntry: (id, data) => apiClient.post(`/bookings/${id}/time`, data),
  addTask: (id, data) => apiClient.post(`/bookings/${id}/tasks`, data),
  updateTask: (bookingId, taskId, data) =>
    apiClient.put(`/bookings/${bookingId}/tasks/${taskId}`, data),
  uploadFiles: (id, formData) =>
    apiClient.upload(`/bookings/${id}/files`, formData),
  addCommunication: (id, data) =>
    apiClient.post(`/bookings/${id}/communications`, data),
  addDispute: (id, data) => apiClient.post(`/bookings/${id}/dispute`, data),
  addRating: (id, data) => apiClient.post(`/bookings/${id}/rating`, data),
  getDashboardStats: () => apiClient.get("/bookings/dashboard/stats"),
};

// Chat API
export const chatAPI = {
  getChats: () => apiClient.get("/chat"),
  createChat: (data) => apiClient.post("/chat/create", data),
  getMessages: (chatId, params = {}) =>
    apiClient.get(`/chat/${chatId}/messages`, { params }),
  sendMessage: (chatId, data) =>
    apiClient.post(`/chat/${chatId}/messages`, data),
  sendImage: (chatId, formData) =>
    apiClient.upload(`/chat/${chatId}/messages/image`, formData),
  getUnreadCount: () => apiClient.get("/chat/unread-count"),
};

// Reviews API
export const reviewsAPI = {
  getSpecialistReviews: (specialistId, params = {}) =>
    apiClient.get(`/reviews/specialist/${specialistId}`, { params }),
  getMyReviews: (params = {}) =>
    apiClient.get("/reviews/my-reviews", { params }),
  createReview: (formData) => apiClient.upload("/reviews", formData),
  updateReview: (id, formData) => apiClient.upload(`/reviews/${id}`, formData),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  addResponse: (id, data) => apiClient.post(`/reviews/${id}/response`, data),
  markHelpful: (id) => apiClient.post(`/reviews/${id}/helpful`),
  reportReview: (id, data) => apiClient.post(`/reviews/${id}/report`, data),
};

// Payments API
export const paymentsAPI = {
  createSubscription: (data) => apiClient.post("/payments/subscription", data),
  checkPaymentStatus: (transactionId) =>
    apiClient.get(`/payments/check/${transactionId}`),
  getPaymentHistory: (params = {}) =>
    apiClient.get("/payments/history", { params }),
};

// Error handling utilities
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data.message || ERROR_MESSAGES.SERVER_ERROR,
      errors: data.errors || [],
    };
  } else if (error.request) {
    // Network error
    return {
      status: 0,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      errors: [],
    };
  } else {
    // Other error
    return {
      status: -1,
      message: error.message || ERROR_MESSAGES.SERVER_ERROR,
      errors: [],
    };
  }
};

// API status checker
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return {
      status: "healthy",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: handleApiError(error),
    };
  }
};

export default api;

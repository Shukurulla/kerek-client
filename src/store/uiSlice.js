import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../utils/helpers";
import { STORAGE_KEYS } from "../utils/constants";

// Initial state
const initialState = {
  // Theme
  theme: getLocalStorage(STORAGE_KEYS.THEME) || "light",

  // Language
  language: getLocalStorage(STORAGE_KEYS.LANGUAGE) || "uz",

  // Layout
  sidebarOpen: false,
  mobileMenuOpen: false,

  // Modals
  modals: {
    auth: {
      isOpen: false,
      tab: "login", // 'login' | 'register'
    },
    profile: {
      isOpen: false,
      tab: "view", // 'view' | 'edit'
    },
    booking: {
      isOpen: false,
      specialistId: null,
    },
    review: {
      isOpen: false,
      bookingId: null,
    },
    filters: {
      isOpen: false,
    },
    imageViewer: {
      isOpen: false,
      images: [],
      currentIndex: 0,
    },
  },

  // Loading states
  loading: {
    global: false,
    page: false,
    component: {},
  },

  // Notifications
  notifications: {
    list: [],
    unreadCount: 0,
    isOpen: false,
  },

  // Search
  search: {
    isOpen: false,
    query: "",
    recentSearches: getLocalStorage("recentSearches") || [],
    suggestions: [],
  },

  // Filters
  filters: {
    isOpen: false,
    applied: {},
    temp: {},
  },

  // Toast notifications
  toasts: [],

  // Page states
  pageStates: {
    scrollPosition: {},
    formData: {},
  },

  // Device info
  device: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: "lg",
  },

  // Connection status
  isOnline: navigator.onLine || true,

  // Performance
  performance: {
    loadTime: 0,
    errors: [],
  },
};

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
      setLocalStorage(STORAGE_KEYS.THEME, action.payload);

      // Apply theme to document
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", action.payload);
        document.documentElement.classList.toggle(
          "dark",
          action.payload === "dark"
        );
      }
    },

    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      setLocalStorage(STORAGE_KEYS.THEME, newTheme);

      // Apply theme to document
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    },

    // Language actions
    setLanguage: (state, action) => {
      state.language = action.payload;
      setLocalStorage(STORAGE_KEYS.LANGUAGE, action.payload);

      // Apply language to document
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", action.payload);
      }
    },

    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },

    // Modal actions
    openModal: (state, action) => {
      const { modal, data = {} } = action.payload;
      if (state.modals[modal]) {
        state.modals[modal].isOpen = true;
        Object.assign(state.modals[modal], data);
      }
    },

    closeModal: (state, action) => {
      const modal = action.payload;
      if (state.modals[modal]) {
        state.modals[modal].isOpen = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal].isOpen = false;
      });
    },

    setModalData: (state, action) => {
      const { modal, data } = action.payload;
      if (state.modals[modal]) {
        Object.assign(state.modals[modal], data);
      }
    },

    // Loading actions
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },

    setPageLoading: (state, action) => {
      state.loading.page = action.payload;
    },

    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.component[component] = loading;
    },

    clearComponentLoading: (state, action) => {
      const component = action.payload;
      delete state.loading.component[component];
    },

    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.list.unshift(notification);
      state.notifications.unreadCount += 1;
    },

    markNotificationRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.list.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.notifications.unreadCount = Math.max(
          0,
          state.notifications.unreadCount - 1
        );
      }
    },

    markAllNotificationsRead: (state) => {
      state.notifications.list.forEach((notification) => {
        notification.read = true;
      });
      state.notifications.unreadCount = 0;
    },

    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const index = state.notifications.list.findIndex(
        (n) => n.id === notificationId
      );
      if (index !== -1) {
        const notification = state.notifications.list[index];
        if (!notification.read) {
          state.notifications.unreadCount = Math.max(
            0,
            state.notifications.unreadCount - 1
          );
        }
        state.notifications.list.splice(index, 1);
      }
    },

    clearAllNotifications: (state) => {
      state.notifications.list = [];
      state.notifications.unreadCount = 0;
    },

    toggleNotifications: (state) => {
      state.notifications.isOpen = !state.notifications.isOpen;
    },

    setNotificationsOpen: (state, action) => {
      state.notifications.isOpen = action.payload;
    },

    // Search actions
    setSearchOpen: (state, action) => {
      state.search.isOpen = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },

    addRecentSearch: (state, action) => {
      const query = action.payload.trim();
      if (query) {
        state.search.recentSearches = [
          query,
          ...state.search.recentSearches.filter((item) => item !== query),
        ].slice(0, 10);
        setLocalStorage("recentSearches", state.search.recentSearches);
      }
    },

    clearRecentSearches: (state) => {
      state.search.recentSearches = [];
      setLocalStorage("recentSearches", []);
    },

    setSearchSuggestions: (state, action) => {
      state.search.suggestions = action.payload;
    },

    // Filter actions
    setFiltersOpen: (state, action) => {
      state.filters.isOpen = action.payload;
    },

    setTempFilters: (state, action) => {
      state.filters.temp = action.payload;
    },

    applyFilters: (state) => {
      state.filters.applied = { ...state.filters.temp };
      state.filters.isOpen = false;
    },

    resetFilters: (state) => {
      state.filters.applied = {};
      state.filters.temp = {};
    },

    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.toasts.push(toast);
    },

    removeToast: (state, action) => {
      const toastId = action.payload;
      state.toasts = state.toasts.filter((toast) => toast.id !== toastId);
    },

    clearAllToasts: (state) => {
      state.toasts = [];
    },

    // Page state actions
    setScrollPosition: (state, action) => {
      const { page, position } = action.payload;
      state.pageStates.scrollPosition[page] = position;
    },

    setFormData: (state, action) => {
      const { page, data } = action.payload;
      state.pageStates.formData[page] = data;
    },

    clearPageState: (state, action) => {
      const page = action.payload;
      delete state.pageStates.scrollPosition[page];
      delete state.pageStates.formData[page];
    },

    // Device actions
    setDeviceInfo: (state, action) => {
      state.device = { ...state.device, ...action.payload };
    },

    // Connection actions
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },

    // Performance actions
    setLoadTime: (state, action) => {
      state.performance.loadTime = action.payload;
    },

    addError: (state, action) => {
      const error = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.performance.errors.push(error);

      // Keep only last 50 errors
      if (state.performance.errors.length > 50) {
        state.performance.errors = state.performance.errors.slice(-50);
      }
    },

    clearErrors: (state) => {
      state.performance.errors = [];
    },

    // Bulk actions
    resetUI: (state) => {
      // Reset to initial state but preserve theme and language
      const { theme, language } = state;
      return {
        ...initialState,
        theme,
        language,
      };
    },
  },
});

// Actions
export const {
  // Theme
  setTheme,
  toggleTheme,

  // Language
  setLanguage,

  // Layout
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,

  // Modals
  openModal,
  closeModal,
  closeAllModals,
  setModalData,

  // Loading
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  clearComponentLoading,

  // Notifications
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearAllNotifications,
  toggleNotifications,
  setNotificationsOpen,

  // Search
  setSearchOpen,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  setSearchSuggestions,

  // Filters
  setFiltersOpen,
  setTempFilters,
  applyFilters,
  resetFilters,

  // Toasts
  addToast,
  removeToast,
  clearAllToasts,

  // Page states
  setScrollPosition,
  setFormData,
  clearPageState,

  // Device
  setDeviceInfo,

  // Connection
  setOnlineStatus,

  // Performance
  setLoadTime,
  addError,
  clearErrors,

  // Bulk
  resetUI,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectLanguage = (state) => state.ui.language;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;

export const selectModals = (state) => state.ui.modals;
export const selectModal = (modalName) => (state) => state.ui.modals[modalName];

export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectPageLoading = (state) => state.ui.loading.page;
export const selectComponentLoading = (componentName) => (state) =>
  state.ui.loading.component[componentName] || false;

export const selectNotifications = (state) => state.ui.notifications.list;
export const selectUnreadNotificationsCount = (state) =>
  state.ui.notifications.unreadCount;
export const selectNotificationsOpen = (state) => state.ui.notifications.isOpen;

export const selectSearchState = (state) => state.ui.search;
export const selectRecentSearches = (state) => state.ui.search.recentSearches;
export const selectSearchSuggestions = (state) => state.ui.search.suggestions;

export const selectFiltersState = (state) => state.ui.filters;
export const selectAppliedFilters = (state) => state.ui.filters.applied;
export const selectTempFilters = (state) => state.ui.filters.temp;

export const selectToasts = (state) => state.ui.toasts;
export const selectPageStates = (state) => state.ui.pageStates;
export const selectDeviceInfo = (state) => state.ui.device;
export const selectIsOnline = (state) => state.ui.isOnline;
export const selectPerformance = (state) => state.ui.performance;

// Complex selectors
export const selectHasUnreadNotifications = (state) =>
  state.ui.notifications.unreadCount > 0;
export const selectIsAnyModalOpen = (state) =>
  Object.values(state.ui.modals).some((modal) => modal.isOpen);
export const selectIsLoading = (state) =>
  state.ui.loading.global ||
  state.ui.loading.page ||
  Object.values(state.ui.loading.component).some((loading) => loading);

export default uiSlice.reducer;

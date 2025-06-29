import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// Import slices
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import specialistsSlice from "./specialistsSlice";
import uiSlice from "./uiSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "user"], // Only persist auth and user data
  blacklist: ["ui"], // Don't persist UI state
};

// Auth persist config (separate for sensitive data)
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"], // Only persist user data and auth status
  blacklist: ["loading", "error"], // Don't persist loading states
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  user: userSlice,
  specialists: specialistsSlice,
  ui: uiSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: {
        warnAfter: 128,
      },
    })
      .concat
      // Add custom middleware here if needed
      // logger, // Redux logger for development
      (),
  devTools: import.meta.env.MODE !== "production",
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
// Remove the TypeScript export type declarations that were causing errors
// Instead, we'll use JSDoc comments for type hints

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

// Export types for use in other files
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;

// Helper function to get typed dispatch
export const useAppDispatch = () => store.dispatch;

// Helper function to get typed selector
export const useAppSelector = (selector) => {
  const state = store.getState();
  return selector(state);
};

// Store utilities
export const clearPersistedState = () => {
  persistor.purge();
};

export const resetStore = () => {
  store.dispatch({ type: "RESET_STORE" });
};

// Action to reset specific slices
export const resetAuth = () => {
  store.dispatch({ type: "auth/reset" });
};

export const resetUser = () => {
  store.dispatch({ type: "user/reset" });
};

export const resetSpecialists = () => {
  store.dispatch({ type: "specialists/reset" });
};

export const resetUI = () => {
  store.dispatch({ type: "ui/reset" });
};

// Development helpers
if (import.meta.env.MODE === "development") {
  // Add store to window for debugging
  window.store = store;
  window.persistor = persistor;

  // Log store state changes
  store.subscribe(() => {
    console.log("Store updated:", store.getState());
  });
}

// Hot module replacement for reducers in development
if (import.meta.env.MODE === "development" && import.meta.hot) {
  import.meta.hot.accept("./authSlice", () => {
    const newAuthSlice = require("./authSlice").default;
    store.replaceReducer(
      persistReducer(
        persistConfig,
        combineReducers({
          auth: persistReducer(authPersistConfig, newAuthSlice),
          user: userSlice,
          specialists: specialistsSlice,
          ui: uiSlice,
        })
      )
    );
  });
}

export default store;

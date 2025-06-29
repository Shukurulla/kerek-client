import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing arrays in localStorage
function useLocalStorageArray(key, initialValue = []) {
  const [array, setArray, removeArray] = useLocalStorage(key, initialValue);

  const addItem = (item) => {
    setArray((currentArray) => [...currentArray, item]);
  };

  const removeItem = (index) => {
    setArray((currentArray) => currentArray.filter((_, i) => i !== index));
  };

  const removeItemByValue = (value) => {
    setArray((currentArray) => currentArray.filter((item) => item !== value));
  };

  const updateItem = (index, newItem) => {
    setArray((currentArray) =>
      currentArray.map((item, i) => (i === index ? newItem : item))
    );
  };

  const clearArray = () => {
    setArray([]);
  };

  const hasItem = (value) => {
    return array.includes(value);
  };

  return {
    array,
    setArray,
    addItem,
    removeItem,
    removeItemByValue,
    updateItem,
    clearArray,
    hasItem,
    removeArray,
  };
}

// Hook for managing objects in localStorage
function useLocalStorageObject(key, initialValue = {}) {
  const [object, setObject, removeObject] = useLocalStorage(key, initialValue);

  const updateProperty = (property, value) => {
    setObject((currentObject) => ({
      ...currentObject,
      [property]: value,
    }));
  };

  const removeProperty = (property) => {
    setObject((currentObject) => {
      const newObject = { ...currentObject };
      delete newObject[property];
      return newObject;
    });
  };

  const clearObject = () => {
    setObject({});
  };

  const hasProperty = (property) => {
    return object.hasOwnProperty(property);
  };

  return {
    object,
    setObject,
    updateProperty,
    removeProperty,
    clearObject,
    hasProperty,
    removeObject,
  };
}

// Hook for managing user preferences
function useUserPreferences() {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    "userPreferences",
    {
      theme: "light",
      language: "uz",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      layout: {
        sidebar: "expanded",
        density: "comfortable",
      },
    }
  );

  const updateTheme = (theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const updateLanguage = (language) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  const updateNotifications = (notifications) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }));
  };

  const updateLayout = (layout) => {
    setPreferences((prev) => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));
  };

  const resetPreferences = () => {
    removePreferences();
  };

  return {
    preferences,
    setPreferences,
    updateTheme,
    updateLanguage,
    updateNotifications,
    updateLayout,
    resetPreferences,
  };
}

// Hook for managing recent searches
function useRecentSearches(maxItems = 10) {
  const {
    array: searches,
    addItem,
    clearArray,
    removeItemByValue,
  } = useLocalStorageArray("recentSearches", []);

  const addSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    // Remove if already exists
    removeItemByValue(searchTerm);

    // Add to beginning
    const newSearches = [searchTerm, ...searches].slice(0, maxItems);
    setArray(newSearches);
  };

  const removeSearch = (searchTerm) => {
    removeItemByValue(searchTerm);
  };

  const clearSearches = () => {
    clearArray();
  };

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

// Hook for managing form drafts
function useFormDraft(formKey) {
  const [draft, setDraft, removeDraft] = useLocalStorage(
    `formDraft_${formKey}`,
    null
  );

  const saveDraft = (formData) => {
    setDraft({
      data: formData,
      timestamp: Date.now(),
    });
  };

  const getDraft = () => {
    if (!draft) return null;

    // Check if draft is older than 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (draft.timestamp < oneDayAgo) {
      removeDraft();
      return null;
    }

    return draft.data;
  };

  const clearDraft = () => {
    removeDraft();
  };

  const hasDraft = () => {
    return getDraft() !== null;
  };

  return {
    saveDraft,
    getDraft,
    clearDraft,
    hasDraft,
  };
}

// Hook for managing view mode preferences
function useViewMode(key, defaultMode = "grid") {
  const [viewMode, setViewMode] = useLocalStorage(
    `viewMode_${key}`,
    defaultMode
  );

  const toggleViewMode = () => {
    setViewMode((current) => (current === "grid" ? "list" : "grid"));
  };

  return [viewMode, setViewMode, toggleViewMode];
}

// Hook for managing favorites
function useFavorites(type) {
  const {
    array: favorites,
    addItem,
    removeItemByValue,
    hasItem,
    clearArray,
  } = useLocalStorageArray(`favorites_${type}`, []);

  const addToFavorites = (id) => {
    if (!hasItem(id)) {
      addItem(id);
    }
  };

  const removeFromFavorites = (id) => {
    removeItemByValue(id);
  };

  const isFavorite = (id) => {
    return hasItem(id);
  };

  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const clearFavorites = () => {
    clearArray();
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}

export default useLocalStorage;
export {
  useLocalStorageArray,
  useLocalStorageObject,
  useUserPreferences,
  useRecentSearches,
  useFormDraft,
  useViewMode,
  useFavorites,
};

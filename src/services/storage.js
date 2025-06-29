// Local Storage utility service
class StorageService {
  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  // Check if localStorage is available
  checkAvailability() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("localStorage not available:", e);
      return false;
    }
  }

  // Generic get method
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      console.warn("Storage not available");
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      // Try to parse as JSON, if fails return as string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return defaultValue;
    }
  }

  // Generic set method
  set(key, value) {
    if (!this.isAvailable) {
      console.warn("Storage not available");
      return false;
    }

    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  // Remove item
  remove(key) {
    if (!this.isAvailable) {
      console.warn("Storage not available");
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  // Clear all storage
  clear() {
    if (!this.isAvailable) {
      console.warn("Storage not available");
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  }

  // Check if key exists
  has(key) {
    if (!this.isAvailable) return false;
    return localStorage.getItem(key) !== null;
  }

  // Get all keys
  getAllKeys() {
    if (!this.isAvailable) return [];

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error("Error getting all keys:", error);
      return [];
    }
  }

  // Get storage size (in bytes)
  getSize() {
    if (!this.isAvailable) return 0;

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error("Error calculating storage size:", error);
      return 0;
    }
  }

  // Authentication related methods
  setToken(token) {
    return this.set("auth_token", token);
  }

  getToken() {
    return this.get("auth_token");
  }

  removeToken() {
    return this.remove("auth_token");
  }

  setRefreshToken(token) {
    return this.set("refresh_token", token);
  }

  getRefreshToken() {
    return this.get("refresh_token");
  }

  removeRefreshToken() {
    return this.remove("refresh_token");
  }

  // User data methods
  setUser(user) {
    return this.set("user_data", user);
  }

  getUser() {
    return this.get("user_data");
  }

  removeUser() {
    return this.remove("user_data");
  }

  updateUser(updates) {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      return this.setUser(updatedUser);
    }
    return false;
  }

  // App preferences
  setPreferences(preferences) {
    return this.set("app_preferences", preferences);
  }

  getPreferences() {
    return this.get("app_preferences", {
      language: "uz",
      theme: "light",
      notifications: true,
      autoSave: true,
    });
  }

  updatePreferences(updates) {
    const currentPrefs = this.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...updates };
    return this.setPreferences(updatedPrefs);
  }

  // Search history
  addSearchHistory(query) {
    const history = this.getSearchHistory();
    const updatedHistory = [
      query,
      ...history.filter((item) => item !== query),
    ].slice(0, 10);
    return this.set("search_history", updatedHistory);
  }

  getSearchHistory() {
    return this.get("search_history", []);
  }

  clearSearchHistory() {
    return this.remove("search_history");
  }

  // Recently viewed specialists
  addRecentSpecialist(specialist) {
    const recent = this.getRecentSpecialists();
    const updatedRecent = [
      specialist,
      ...recent.filter((item) => item.id !== specialist.id),
    ].slice(0, 20);
    return this.set("recent_specialists", updatedRecent);
  }

  getRecentSpecialists() {
    return this.get("recent_specialists", []);
  }

  clearRecentSpecialists() {
    return this.remove("recent_specialists");
  }

  // Favorites
  addFavorite(item, type = "specialist") {
    const favorites = this.getFavorites(type);
    if (!favorites.find((fav) => fav.id === item.id)) {
      favorites.push({ ...item, addedAt: new Date().toISOString() });
      return this.set(`favorites_${type}`, favorites);
    }
    return true;
  }

  removeFavorite(itemId, type = "specialist") {
    const favorites = this.getFavorites(type);
    const updatedFavorites = favorites.filter((fav) => fav.id !== itemId);
    return this.set(`favorites_${type}`, updatedFavorites);
  }

  getFavorites(type = "specialist") {
    return this.get(`favorites_${type}`, []);
  }

  isFavorite(itemId, type = "specialist") {
    const favorites = this.getFavorites(type);
    return favorites.some((fav) => fav.id === itemId);
  }

  clearFavorites(type = "specialist") {
    return this.remove(`favorites_${type}`);
  }

  // Draft data (for forms)
  saveDraft(key, data) {
    const drafts = this.get("drafts", {});
    drafts[key] = {
      data,
      savedAt: new Date().toISOString(),
    };
    return this.set("drafts", drafts);
  }

  getDraft(key) {
    const drafts = this.get("drafts", {});
    return drafts[key]?.data || null;
  }

  removeDraft(key) {
    const drafts = this.get("drafts", {});
    delete drafts[key];
    return this.set("drafts", drafts);
  }

  getAllDrafts() {
    return this.get("drafts", {});
  }

  // Cache management
  setCache(key, data, ttl = 3600000) {
    // Default TTL: 1 hour
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    return this.set(`cache_${key}`, cacheItem);
  }

  getCache(key) {
    const cacheItem = this.get(`cache_${key}`);
    if (!cacheItem) return null;

    const { data, timestamp, ttl } = cacheItem;

    // Check if cache is expired
    if (Date.now() - timestamp > ttl) {
      this.remove(`cache_${key}`);
      return null;
    }

    return data;
  }

  invalidateCache(key) {
    return this.remove(`cache_${key}`);
  }

  clearExpiredCache() {
    const keys = this.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith("cache_"));

    cacheKeys.forEach((key) => {
      const cacheItem = this.get(key);
      if (cacheItem && Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        this.remove(key);
      }
    });
  }

  // Session data (temporary data)
  setSessionData(key, data) {
    return this.set(`session_${key}`, data);
  }

  getSessionData(key) {
    return this.get(`session_${key}`);
  }

  removeSessionData(key) {
    return this.remove(`session_${key}`);
  }

  clearSessionData() {
    const keys = this.getAllKeys();
    const sessionKeys = keys.filter((key) => key.startsWith("session_"));
    sessionKeys.forEach((key) => this.remove(key));
  }

  // App state persistence
  saveAppState(state) {
    return this.set("app_state", {
      ...state,
      savedAt: new Date().toISOString(),
    });
  }

  getAppState() {
    return this.get("app_state");
  }

  // Analytics and tracking
  trackEvent(event, data) {
    const events = this.get("analytics_events", []);
    events.push({
      event,
      data,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 events
    const recentEvents = events.slice(-100);
    return this.set("analytics_events", recentEvents);
  }

  getAnalyticsEvents() {
    return this.get("analytics_events", []);
  }

  clearAnalyticsEvents() {
    return this.remove("analytics_events");
  }

  // Migration helper
  migrate(migrations) {
    const currentVersion = this.get("storage_version", "1.0.0");

    migrations.forEach((migration) => {
      if (this.compareVersions(currentVersion, migration.version) < 0) {
        try {
          migration.migrate(this);
          console.log(`Migrated storage to version ${migration.version}`);
        } catch (error) {
          console.error(`Migration to ${migration.version} failed:`, error);
        }
      }
    });

    // Update storage version
    const latestVersion =
      migrations[migrations.length - 1]?.version || currentVersion;
    this.set("storage_version", latestVersion);
  }

  // Version comparison utility
  compareVersions(version1, version2) {
    const parts1 = version1.split(".").map(Number);
    const parts2 = version2.split(".").map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }

    return 0;
  }

  // Backup and restore
  createBackup() {
    if (!this.isAvailable) return null;

    try {
      const backup = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
      }

      return {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        data: backup,
      };
    } catch (error) {
      console.error("Error creating backup:", error);
      return null;
    }
  }

  restoreBackup(backup) {
    if (!this.isAvailable || !backup || !backup.data) return false;

    try {
      // Clear current storage
      this.clear();

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      return true;
    } catch (error) {
      console.error("Error restoring backup:", error);
      return false;
    }
  }

  // Export all data
  exportData() {
    return this.createBackup();
  }

  // Import data
  importData(data) {
    return this.restoreBackup(data);
  }
}

// Create and export singleton instance
const storageService = new StorageService();

export default storageService;

// Export class for testing or multiple instances
export { StorageService };

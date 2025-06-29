import api from "./api";

const AUTH_TOKEN_KEY = "mutaxassislar_token";
const USER_DATA_KEY = "mutaxassislar_user";

class AuthService {
  // Token management
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }

  // User data management
  getUserData() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(user) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  removeUserData() {
    localStorage.removeItem(USER_DATA_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Auth API calls
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Ro'yxatdan o'tishda xato yuz berdi",
      };
    }
  }

  async verify(verificationData) {
    try {
      const response = await api.post("/auth/verify", verificationData);

      if (response.data.token) {
        this.setToken(response.data.token);
        this.setUserData(response.data.user);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Tasdiqlashda xato yuz berdi",
      };
    }
  }

  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Kirishda xato yuz berdi",
      };
    }
  }

  async verifyLogin(verificationData) {
    try {
      const response = await api.post("/auth/login/verify", verificationData);

      if (response.data.token) {
        this.setToken(response.data.token);
        this.setUserData(response.data.user);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Tasdiqlashda xato yuz berdi",
      };
    }
  }

  async resendCode(data) {
    try {
      const response = await api.post("/auth/resend-code", data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Kod yuborishda xato yuz berdi",
      };
    }
  }

  async forgotPassword(phone) {
    try {
      const response = await api.post("/auth/forgot-password", { phone });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Parolni tiklashda xato yuz berdi",
      };
    }
  }

  async resetPassword(resetData) {
    try {
      const response = await api.post("/auth/reset-password", resetData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Parolni o'zgartirishda xato yuz berdi",
      };
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.post("/auth/change-password", passwordData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Parolni o'zgartirishda xato yuz berdi",
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put("/users/profile", profileData);

      // Update stored user data
      this.setUserData(response.data.user);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Profilni yangilashda xato yuz berdi",
      };
    }
  }

  async uploadProfileImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const response = await api.post("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Rasm yuklashda xato yuz berdi",
      };
    }
  }

  async refreshToken() {
    try {
      const response = await api.post("/auth/refresh");

      if (response.data.token) {
        this.setToken(response.data.token);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logout();
      return {
        success: false,
        error: "Tokenni yangilashda xato yuz berdi",
      };
    }
  }

  async checkAuth() {
    try {
      const response = await api.get("/auth/me");
      this.setUserData(response.data.user);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logout();
      return {
        success: false,
        error: "Autentifikatsiya tekshirishda xato yuz berdi",
      };
    }
  }

  logout() {
    this.removeToken();
    this.removeUserData();

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // Initialize auth from stored data
  initializeAuth() {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  }

  // Get current user
  getCurrentUser() {
    return this.getUserData();
  }

  // Check user role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is specialist
  isSpecialist() {
    return this.hasRole("specialist");
  }

  // Check if user is client
  isClient() {
    return this.hasRole("client");
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole("admin");
  }

  // Get user permissions
  getPermissions() {
    const user = this.getCurrentUser();
    if (!user) return [];

    const permissions = ["read:profile"];

    if (user.role === "specialist") {
      permissions.push(
        "read:bookings",
        "create:bookings",
        "update:profile",
        "read:reviews",
        "respond:reviews"
      );
    }

    if (user.role === "client") {
      permissions.push(
        "read:specialists",
        "create:bookings",
        "read:bookings",
        "create:reviews"
      );
    }

    if (user.role === "admin") {
      permissions.push("read:all", "write:all", "delete:all", "manage:users");
    }

    return permissions;
  }

  // Check permission
  hasPermission(permission) {
    const permissions = this.getPermissions();
    return (
      permissions.includes(permission) || permissions.includes("write:all")
    );
  }
}

const authService = new AuthService();

// Initialize auth on service creation
authService.initializeAuth();

export default authService;

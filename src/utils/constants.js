// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY: "/auth/verify",
    LOGIN: "/auth/login",
    LOGIN_VERIFY: "/auth/login/verify",
    RESEND_CODE: "/auth/resend-code",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },

  // Users
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    UPLOAD_IMAGE: "/users/profile/image",
    UPLOAD_COVER: "/users/profile/cover",
    UPLOAD_GALLERY: "/users/profile/gallery",
    ADD_CATEGORY: "/users/categories",
    ADD_CERTIFICATE: "/users/certificates",
    ADD_EXPERIENCE: "/users/experience",
    ADD_EDUCATION: "/users/education",
    ADD_SERVICE: "/users/services",
    UPDATE_AVAILABILITY: "/users/availability",
    UPDATE_STATUS: "/users/status",
    UPDATE_PREFERENCES: "/users/preferences",
    SPECIALISTS_SEARCH: "/users/specialists/search",
    SPECIALIST_DETAIL: "/users/specialists",
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: "/categories",
    SUBCATEGORIES: "/categories",
    SEARCH: "/categories/search",
    TRENDING: "/categories/special/trending",
    FEATURED: "/categories/special/featured",
    POPULAR: "/categories/special/popular",
    FIELDS: "/categories",
  },

  // Bookings
  BOOKINGS: {
    LIST: "/bookings",
    CREATE: "/bookings",
    DETAIL: "/bookings",
    UPDATE_STATUS: "/bookings",
    UPDATE: "/bookings",
    ADD_TIME: "/bookings",
    ADD_TASK: "/bookings",
    UPDATE_TASK: "/bookings",
    UPLOAD_FILES: "/bookings",
    ADD_COMMUNICATION: "/bookings",
    ADD_DISPUTE: "/bookings",
    ADD_RATING: "/bookings",
    STATS: "/bookings/dashboard/stats",
  },

  // Chat
  CHAT: {
    LIST: "/chat",
    CREATE: "/chat/create",
    MESSAGES: "/chat",
    SEND_MESSAGE: "/chat",
    SEND_IMAGE: "/chat",
    UNREAD_COUNT: "/chat/unread-count",
  },

  // Reviews
  REVIEWS: {
    SPECIALIST_REVIEWS: "/reviews/specialist",
    MY_REVIEWS: "/reviews/my-reviews",
    CREATE: "/reviews",
    UPDATE: "/reviews",
    DELETE: "/reviews",
    ADD_RESPONSE: "/reviews",
    MARK_HELPFUL: "/reviews",
    REPORT: "/reviews",
  },

  // Payments
  PAYMENTS: {
    CREATE_SUBSCRIPTION: "/payments/subscription",
    CHECK_STATUS: "/payments/check",
    HISTORY: "/payments/history",
  },
};

// User Roles
export const USER_ROLES = {
  CLIENT: "client",
  SPECIALIST: "specialist",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

// Booking Status
export const BOOKING_STATUS = {
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_PROGRESS: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CLICK: "click",
  PAYME: "payme",
  UZCARD: "uzcard",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  SYSTEM: "system",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_REQUEST: "booking_request",
  BOOKING_ACCEPTED: "booking_accepted",
  BOOKING_REJECTED: "booking_rejected",
  BOOKING_COMPLETED: "booking_completed",
  PAYMENT_SUCCESS: "payment_success",
  NEW_MESSAGE: "new_message",
  NEW_REVIEW: "new_review",
  SYSTEM: "system",
};

// File Upload Limits
export const FILE_LIMITS = {
  PROFILE_IMAGE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
  PORTFOLIO: {
    maxSize: 8 * 1024 * 1024, // 8MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxCount: 10,
  },
  CHAT_FILE: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};

// Uzbekistan Cities
export const CITIES = [
  "Toshkent",
  "Toshkent viloyati",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qashqadaryo",
  "Surxondaryo",
  "Jizzax",
  "Sirdaryo",
  "Navoiy",
  "Xorazm",
  "Qoraqalpog'iston",
];

// Default Categories
export const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: "IT va Dasturlash",
    slug: "it-va-dasturlash",
    icon: "💻",
    color: "#3B82F6",
    description: "Veb-sayt, mobil ilova va dasturiy ta'minot ishlab chiqish",
  },
  {
    id: 2,
    name: "Dizayn va San'at",
    slug: "dizayn-va-sanat",
    icon: "🎨",
    color: "#EC4899",
    description: "Grafik dizayn, UI/UX, brending va boshqa ijodiy xizmatlar",
  },
  {
    id: 3,
    name: "Marketing va Reklama",
    slug: "marketing-va-reklama",
    icon: "📢",
    color: "#F59E0B",
    description: "Digital marketing, SMM, SEO va reklama kampaniyalari",
  },
  {
    id: 4,
    name: "Ta'lim va Tarbiya",
    slug: "talim-va-tarbiya",
    icon: "🎓",
    color: "#10B981",
    description: "Onlayn darslar, konsultatsiya va ta'lim xizmatlari",
  },
  {
    id: 5,
    name: "Muhandislik",
    slug: "muhandislik",
    icon: "⚙️",
    color: "#6366F1",
    description: "Texnik loyihalar, qurilish va muhandislik xizmatlari",
  },
  {
    id: 6,
    name: "Tibbiyot",
    slug: "tibbiyot",
    icon: "🏥",
    color: "#EF4444",
    description: "Tibbiy konsultatsiya va sog'liqni saqlash xizmatlari",
  },
];

// Skill Levels
export const SKILL_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
};

// Languages
export const LANGUAGES = {
  UZBEK: "uzbek",
  RUSSIAN: "russian",
  ENGLISH: "english",
  KARAKALPAK: "karakalpak",
};

// Language Levels
export const LANGUAGE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  NATIVE: "native",
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "free",
    price: 0,
    features: {
      maxCategories: 1,
      maxPortfolioImages: 5,
      canInitiateChat: false,
      priorityListing: false,
    },
  },
  BASIC: {
    name: "basic",
    price: 20000, // UZS
    features: {
      maxCategories: 3,
      maxPortfolioImages: 20,
      canInitiateChat: true,
      priorityListing: false,
    },
  },
  PREMIUM: {
    name: "premium",
    price: 50000, // UZS
    features: {
      maxCategories: -1, // unlimited
      maxPortfolioImages: -1, // unlimited
      canInitiateChat: true,
      priorityListing: true,
    },
  },
};

// Sort Options
export const SORT_OPTIONS = {
  RATING: "rating",
  PRICE_LOW: "price_low",
  PRICE_HIGH: "price_high",
  EXPERIENCE: "experience",
  NEWEST: "newest",
  POPULAR: "popular",
  COMPLETION_RATE: "completion_rate",
};

// Filters
export const FILTER_OPTIONS = {
  VERIFIED_ONLY: "verified_only",
  ONLINE_ONLY: "online_only",
  HAS_PORTFOLIO: "has_portfolio",
  HAS_CERTIFICATES: "has_certificates",
  REMOTE_WORK: "remote_work",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "mutaxassislar_auth_token",
  REFRESH_TOKEN: "mutaxassislar_refresh_token",
  USER_DATA: "mutaxassislar_user_data",
  SEARCH_HISTORY: "mutaxassislar_search_history",
  THEME: "mutaxassislar_theme",
  LANGUAGE: "mutaxassislar_language",
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  NEW_MESSAGE: "new_message",
  MESSAGE_READ: "message_read",
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",
  BOOKING_UPDATE: "booking_update",
  NOTIFICATION: "notification",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Internetga ulanishda xato yuz berdi",
  SERVER_ERROR: "Server xatosi yuz berdi",
  VALIDATION_ERROR: "Ma'lumotlar to'g'ri emas",
  AUTH_REQUIRED: "Tizimga kirish talab qilinadi",
  ACCESS_DENIED: "Ruxsat yo'q",
  NOT_FOUND: "Ma'lumot topilmadi",
  FILE_TOO_LARGE: "Fayl hajmi juda katta",
  INVALID_FILE_TYPE: "Fayl turi noto'g'ri",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profil muvaffaqiyatli yangilandi",
  IMAGE_UPLOADED: "Rasm muvaffaqiyatli yuklandi",
  MESSAGE_SENT: "Xabar yuborildi",
  BOOKING_CREATED: "Booking yaratildi",
  PAYMENT_SUCCESS: "To'lov muvaffaqiyatli amalga oshirildi",
  REVIEW_SUBMITTED: "Baholash yuborildi",
};

// Validation Rules
export const VALIDATION_RULES = {
  PHONE: {
    pattern: /^\+998[0-9]{9}$/,
    message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak",
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Email manzil noto'g'ri",
  },
  PASSWORD: {
    minLength: 6,
    message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
  },
  NAME: {
    minLength: 2,
    maxLength: 50,
    message: "Ism 2-50 belgi orasida bo'lishi kerak",
  },
};

// Date Formats
export const DATE_FORMATS = {
  FULL: "dd MMMM yyyy, HH:mm",
  DATE_ONLY: "dd MMMM yyyy",
  TIME_ONLY: "HH:mm",
  SHORT: "dd.MM.yyyy",
  ISO: "yyyy-MM-dd",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
};

// Timeouts
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  DEBOUNCE_SEARCH: 500, // 0.5 seconds
  TOAST_DURATION: 4000, // 4 seconds
  SOCKET_TIMEOUT: 5000, // 5 seconds
};

// Feature Flags
export const FEATURES = {
  ENABLE_CHAT: true,
  ENABLE_PAYMENTS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REVIEWS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_DARK_MODE: true,
};

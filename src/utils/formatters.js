// Number formatters
export const formatPrice = (price, currency = "UZS") => {
  if (!price || isNaN(price)) return "0 so'm";

  const formatted = new Intl.NumberFormat("uz-UZ").format(price);

  const currencyMap = {
    UZS: "so'm",
    USD: "$",
    EUR: "€",
    RUB: "₽",
  };

  return `${formatted} ${currencyMap[currency] || currency}`;
};

export const formatNumber = (number, options = {}) => {
  if (!number || isNaN(number)) return "0";

  return new Intl.NumberFormat("uz-UZ", options).format(number);
};

export const formatPercent = (value, decimals = 1) => {
  if (!value || isNaN(value)) return "0%";

  return `${Number(value).toFixed(decimals)}%`;
};

export const formatCompactNumber = (number) => {
  if (!number || isNaN(number)) return "0";

  const absNumber = Math.abs(number);

  if (absNumber >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "mlrd";
  } else if (absNumber >= 1000000) {
    return (number / 1000000).toFixed(1) + "mln";
  } else if (absNumber >= 1000) {
    return (number / 1000).toFixed(1) + "ming";
  }

  return number.toString();
};

// Date formatters
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return dateObj.toLocaleDateString("uz-UZ", defaultOptions);
};

export const formatDateTime = (date, options = {}) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return dateObj.toLocaleString("uz-UZ", defaultOptions);
};

export const formatTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return "Hozir";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} daqiqa oldin`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} soat oldin`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} kun oldin`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} hafta oldin`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} oy oldin`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} yil oldin`;
  }
};

export const timeAgo = formatRelativeTime; // Alias

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0 soniya";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} soat`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} daqiqa`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} soniya`);
  }

  return parts.join(" ");
};

// Phone number formatter
export const formatPhone = (phone) => {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Check for Uzbekistan format
  if (cleaned.startsWith("998") && cleaned.length === 12) {
    return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8,
      10
    )} ${cleaned.slice(10, 12)}`;
  }

  // Generic format for other numbers
  if (cleaned.length >= 10) {
    return `+${cleaned}`;
  }

  return phone;
};

// Name formatter
export const formatName = (firstName, lastName, middleName) => {
  const parts = [firstName, lastName, middleName].filter(Boolean);
  return parts.join(" ");
};

export const formatInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last;
};

// Address formatter
export const formatAddress = (address) => {
  if (!address) return "";

  const parts = [];

  if (address.street) parts.push(address.street);
  if (address.district) parts.push(address.district);
  if (address.city) parts.push(address.city);
  if (address.region && address.region !== address.city)
    parts.push(address.region);

  return parts.join(", ");
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Text formatters
export const truncateText = (text, maxLength = 100, suffix = "...") => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirst = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return "";

  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

export const slugify = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
};

// URL formatter
export const formatUrl = (url) => {
  if (!url) return "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

// Social media formatters
export const formatTelegramUsername = (username) => {
  if (!username) return "";

  const cleaned = username.replace(/^@/, "");
  return `@${cleaned}`;
};

export const formatInstagramUsername = (username) => {
  if (!username) return "";

  const cleaned = username.replace(/^@/, "");
  return `@${cleaned}`;
};

// Rating formatter
export const formatRating = (rating, maxRating = 5) => {
  if (!rating || isNaN(rating)) return "0.0";

  return Math.min(Math.max(rating, 0), maxRating).toFixed(1);
};

// Distance formatter
export const formatDistance = (distanceInKm) => {
  if (!distanceInKm || isNaN(distanceInKm)) return "";

  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  } else if (distanceInKm < 10) {
    return `${distanceInKm.toFixed(1)} km`;
  } else {
    return `${Math.round(distanceInKm)} km`;
  }
};

// Status formatter
export const formatStatus = (status) => {
  const statusMap = {
    pending: "Kutilmoqda",
    approved: "Tasdiqlangan",
    rejected: "Rad etilgan",
    active: "Faol",
    inactive: "Nofaol",
    completed: "Tugallangan",
    cancelled: "Bekor qilingan",
    in_progress: "Jarayonda",
    draft: "Qoralama",
  };

  return statusMap[status] || status;
};

// Language formatter
export const formatLanguage = (langCode) => {
  const languageMap = {
    uz: "O'zbek",
    ru: "Русский",
    en: "English",
    kaa: "Қарақалпақ",
  };

  return languageMap[langCode] || langCode;
};

// Array formatter
export const formatList = (items, separator = ", ", lastSeparator = " va ") => {
  if (!Array.isArray(items) || items.length === 0) return "";

  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(lastSeparator);

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return otherItems.join(separator) + lastSeparator + lastItem;
};

// Default export object
const formatters = {
  // Numbers
  formatPrice,
  formatNumber,
  formatPercent,
  formatCompactNumber,

  // Dates
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  timeAgo,
  formatDuration,

  // Strings
  formatPhone,
  formatName,
  formatInitials,
  formatAddress,
  formatFileSize,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  slugify,
  formatUrl,
  formatTelegramUsername,
  formatInstagramUsername,

  // Others
  formatRating,
  formatDistance,
  formatStatus,
  formatLanguage,
  formatList,
};

export default formatters;

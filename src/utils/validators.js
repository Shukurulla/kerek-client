// Basic validators
export const required = (value, message = "Bu maydon majburiy") => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return message;
  }
  return null;
};

export const minLength = (min, message) => (value) => {
  if (!value) return null;
  if (value.length < min) {
    return message || `Kamida ${min} ta belgi kiriting`;
  }
  return null;
};

export const maxLength = (max, message) => (value) => {
  if (!value) return null;
  if (value.length > max) {
    return message || `Maksimal ${max} ta belgi kiriting`;
  }
  return null;
};

export const minValue = (min, message) => (value) => {
  if (!value) return null;
  const numValue = Number(value);
  if (isNaN(numValue) || numValue < min) {
    return message || `Qiymat ${min} dan kam bo'lmasligi kerak`;
  }
  return null;
};

export const maxValue = (max, message) => (value) => {
  if (!value) return null;
  const numValue = Number(value);
  if (isNaN(numValue) || numValue > max) {
    return message || `Qiymat ${max} dan oshmasligi kerak`;
  }
  return null;
};

// Email validator
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const email =
  (message = "Email manzil noto'g'ri") =>
  (value) => {
    if (!value) return null;
    if (!isValidEmail(value)) {
      return message;
    }
    return null;
  };

// Phone validator (Uzbekistan format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+998[0-9]{9}$/;
  return phoneRegex.test(phone);
};

export const phone =
  (message = "Telefon raqam noto'g'ri formatda") =>
  (value) => {
    if (!value) return null;
    if (!isValidPhone(value)) {
      return message;
    }
    return null;
  };

// URL validator
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const url =
  (message = "URL noto'g'ri formatda") =>
  (value) => {
    if (!value) return null;

    // Add protocol if missing
    let fullUrl = value;
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      fullUrl = `https://${value}`;
    }

    if (!isValidUrl(fullUrl)) {
      return message;
    }
    return null;
  };

// Number validator
export const isNumber =
  (message = "Faqat raqam kiriting") =>
  (value) => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return message;
    }
    return null;
  };

// Pattern validator
export const pattern =
  (regex, message = "Format noto'g'ri") =>
  (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  };

// Custom validators
export const onlyLetters = (message = "Faqat harflar kiriting") => {
  return pattern(/^[a-zA-ZА-Яа-яЁёўғқҳҲҚӯӰ\s]+$/u, message);
};

export const onlyNumbers = (message = "Faqat raqamlar kiriting") => {
  return pattern(/^\d+$/, message);
};

export const alphanumeric = (
  message = "Faqat harflar va raqamlar kiriting"
) => {
  return pattern(/^[a-zA-Z0-9А-Яа-яЁёўғқҳҲҚӯӰ\s]+$/u, message);
};

// Date validators
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const dateValidator =
  (message = "Sana noto'g'ri") =>
  (value) => {
    if (!value) return null;
    if (!isValidDate(value)) {
      return message;
    }
    return null;
  };

export const minDate = (minDate, message) => (value) => {
  if (!value) return null;
  const inputDate = new Date(value);
  const min = new Date(minDate);

  if (inputDate < min) {
    return (
      message ||
      `Sana ${min.toLocaleDateString("uz-UZ")} dan oldin bo'lmasligi kerak`
    );
  }
  return null;
};

export const maxDate = (maxDate, message) => (value) => {
  if (!value) return null;
  const inputDate = new Date(value);
  const max = new Date(maxDate);

  if (inputDate > max) {
    return (
      message ||
      `Sana ${max.toLocaleDateString("uz-UZ")} dan keyin bo'lmasligi kerak`
    );
  }
  return null;
};

export const futureDate =
  (message = "Kelajakdagi sana kiriting") =>
  (value) => {
    if (!value) return null;
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate <= today) {
      return message;
    }
    return null;
  };

export const pastDate =
  (message = "O'tmishdagi sana kiriting") =>
  (value) => {
    if (!value) return null;
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (inputDate >= today) {
      return message;
    }
    return null;
  };

// Age validator
export const minAge = (min, message) => (value) => {
  if (!value) return null;
  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  let actualAge = age;
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    actualAge--;
  }

  if (actualAge < min) {
    return message || `Kamida ${min} yoshda bo'lishingiz kerak`;
  }
  return null;
};

export const maxAge = (max, message) => (value) => {
  if (!value) return null;
  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  let actualAge = age;
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    actualAge--;
  }

  if (actualAge > max) {
    return message || `Maksimal ${max} yoshda bo'lishingiz kerak`;
  }
  return null;
};

// File validators
export const fileRequired =
  (message = "Fayl tanlang") =>
  (file) => {
    if (!file) {
      return message;
    }
    return null;
  };

export const fileSize = (maxSizeInMB, message) => (file) => {
  if (!file) return null;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return message || `Fayl hajmi ${maxSizeInMB}MB dan oshmasligi kerak`;
  }
  return null;
};

export const fileType = (allowedTypes, message) => (file) => {
  if (!file) return null;

  const isAllowed = allowedTypes.some((type) => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.startsWith(type);
  });

  if (!isAllowed) {
    return (
      message ||
      `Faqat ${allowedTypes.join(", ")} formatdagi fayllar ruxsat etilgan`
    );
  }
  return null;
};

// Password validators
export const passwordStrength =
  (message = "Parol yetarlicha kuchli emas") =>
  (value) => {
    if (!value) return null;

    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    const score = [
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (score < 3) {
      return message;
    }
    return null;
  };

export const confirmPassword =
  (originalPassword, message = "Parollar mos kelmaydi") =>
  (value) => {
    if (!value) return null;
    if (value !== originalPassword) {
      return message;
    }
    return null;
  };

// Array validators
export const arrayMinLength = (min, message) => (value) => {
  if (!Array.isArray(value)) return null;
  if (value.length < min) {
    return message || `Kamida ${min} ta element tanlang`;
  }
  return null;
};

export const arrayMaxLength = (max, message) => (value) => {
  if (!Array.isArray(value)) return null;
  if (value.length > max) {
    return message || `Maksimal ${max} ta element tanlang`;
  }
  return null;
};

// Custom business validators
export const validUsername = (message = "Username noto'g'ri formatda") => {
  return pattern(/^[a-zA-Z0-9_-]{3,20}$/, message);
};

export const validSlug = (message = "Slug noto'g'ri formatda") => {
  return pattern(/^[a-z0-9-]+$/, message);
};

export const validPrice =
  (message = "Narx noto'g'ri") =>
  (value) => {
    if (!value) return null;
    const price = Number(value);
    if (isNaN(price) || price < 0) {
      return message;
    }
    return null;
  };

export const validRating =
  (message = "Reyting 1-5 orasida bo'lishi kerak") =>
  (value) => {
    if (!value) return null;
    const rating = Number(value);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return message;
    }
    return null;
  };

export const validCoordinates =
  (message = "Koordinatalar noto'g'ri") =>
  (value) => {
    if (!value) return null;
    if (!Array.isArray(value) || value.length !== 2) {
      return message;
    }

    const [lng, lat] = value;
    if (
      isNaN(lng) ||
      isNaN(lat) ||
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      return message;
    }
    return null;
  };

// Composite validators
export const compose =
  (...validators) =>
  (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };

// Validation helper functions
export const validateField = (value, validators) => {
  if (!Array.isArray(validators)) {
    validators = [validators];
  }

  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, validators] of Object.entries(validationRules)) {
    const error = validateField(formData[field], validators);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Real-time validation hook helper
export const createValidator = (validators) => {
  return (value) => validateField(value, validators);
};

// Common validation rule sets
export const commonValidations = {
  name: [required(), minLength(2), maxLength(50), onlyLetters()],
  email: [required(), email()],
  phone: [required(), phone()],
  password: [required(), minLength(8), passwordStrength()],
  url: [url()],
  price: [required(), validPrice(), minValue(0)],
  rating: [required(), validRating()],
  text: [required(), minLength(1), maxLength(1000)],
  shortText: [required(), minLength(1), maxLength(100)],
  longText: [required(), minLength(10), maxLength(5000)],
  username: [required(), validUsername()],
  slug: [required(), validSlug()],
  age: [required(), minAge(18), maxAge(100)],
  experience: [required(), minValue(0), maxValue(50)],
  profileImage: [
    fileType(["image/jpeg", "image/png", "image/webp"]),
    fileSize(5),
  ],
  document: [fileType(["application/pdf", ".doc", ".docx"]), fileSize(10)],
};

// Export all validators
const validators = {
  // Basic
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,

  // Format
  email,
  phone,
  url,
  isNumber,
  pattern,
  onlyLetters,
  onlyNumbers,
  alphanumeric,

  // Date
  dateValidator,
  minDate,
  maxDate,
  futureDate,
  pastDate,
  minAge,
  maxAge,

  // File
  fileRequired,
  fileSize,
  fileType,

  // Password
  passwordStrength,
  confirmPassword,

  // Array
  arrayMinLength,
  arrayMaxLength,

  // Business
  validUsername,
  validSlug,
  validPrice,
  validRating,
  validCoordinates,

  // Utilities
  compose,
  validateField,
  validateForm,
  createValidator,

  // Helper functions
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidDate,

  // Common rules
  commonValidations,
};

export default validators;

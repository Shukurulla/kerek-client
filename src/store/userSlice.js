import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersAPI } from "../services/api";
import { toast } from "react-hot-toast";

// Initial state
const initialState = {
  currentUser: null,
  profile: null,
  loading: false,
  updating: false,
  uploading: false,
  error: null,

  // Profile completion
  profileCompletion: {
    percentage: 0,
    missingFields: [],
  },

  // Specialists data
  specialists: {
    list: [],
    featured: [],
    recommended: [],
    loading: false,
    hasMore: true,
    page: 1,
    filters: {},
  },

  // User stats
  stats: {
    totalProjects: 0,
    completedProjects: 0,
    averageRating: 0,
    totalEarnings: 0,
    responseTime: 0,
  },
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profil ma'lumotlarini olishda xato"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profilni yangilashda xato"
      );
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await usersAPI.uploadProfileImage(formData, onProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Rasm yuklashda xato"
      );
    }
  }
);

export const uploadCoverImage = createAsyncThunk(
  "user/uploadCoverImage",
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const response = await usersAPI.uploadCoverImage(formData, onProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Cover rasm yuklashda xato"
      );
    }
  }
);

export const uploadGallery = createAsyncThunk(
  "user/uploadGallery",
  async ({ files, captions, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("gallery", file);
        if (captions[index]) {
          formData.append("captions", captions[index]);
        }
      });

      const response = await usersAPI.uploadGallery(formData, onProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Galeriya yuklashda xato"
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "user/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.addCategory(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kategoriya qo'shishda xato"
      );
    }
  }
);

export const addExperience = createAsyncThunk(
  "user/addExperience",
  async (experienceData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.addExperience(experienceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Tajriba qo'shishda xato"
      );
    }
  }
);

export const addEducation = createAsyncThunk(
  "user/addEducation",
  async (educationData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.addEducation(educationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ta'lim ma'lumotlarini qo'shishda xato"
      );
    }
  }
);

export const addService = createAsyncThunk(
  "user/addService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.addService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Xizmat qo'shishda xato"
      );
    }
  }
);

export const updateAvailability = createAsyncThunk(
  "user/updateAvailability",
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateAvailability(availabilityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Mavjudlikni yangilashda xato"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "user/updateStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateStatus({ isOnline: status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Holatni yangilashda xato"
      );
    }
  }
);

export const searchSpecialists = createAsyncThunk(
  "user/searchSpecialists",
  async (searchParams, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const { page = 1, ...filters } = searchParams;

      const params = {
        page,
        limit: 20,
        ...filters,
      };

      const response = await usersAPI.searchSpecialists(params);
      return {
        data: response.data,
        page,
        isNewSearch: page === 1,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Qidirishda xato"
      );
    }
  }
);

export const getSpecialistDetail = createAsyncThunk(
  "user/getSpecialistDetail",
  async (specialistId, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getSpecialistDetail(specialistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Mutaxassis ma'lumotlarini olishda xato"
      );
    }
  }
);

// Helper function to calculate profile completion
const calculateProfileCompletion = (user) => {
  if (!user) return { percentage: 0, missingFields: [] };

  const requiredFields = [
    { key: "name", label: "Ism" },
    { key: "phone", label: "Telefon raqam" },
    { key: "city", label: "Shahar" },
    { key: "profileImage", label: "Profil rasmi" },
    { key: "description", label: "Tavsif" },
  ];

  if (user.role === "specialist") {
    requiredFields.push(
      {
        key: "categories",
        label: "Kategoriyalar",
        check: (u) => u.categories?.length > 0,
      },
      {
        key: "skills",
        label: "Ko'nikmalar",
        check: (u) => u.skills?.length > 0,
      },
      {
        key: "experience",
        label: "Tajriba",
        check: (u) => u.experience?.length > 0,
      }
    );
  }

  const missingFields = [];
  let completedFields = 0;

  requiredFields.forEach((field) => {
    const hasValue = field.check
      ? field.check(user)
      : user[field.key] && user[field.key] !== "";

    if (hasValue) {
      completedFields++;
    } else {
      missingFields.push(field.label);
    }
  });

  const percentage = Math.round(
    (completedFields / requiredFields.length) * 100
  );

  return { percentage, missingFields };
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSpecialistFilters: (state, action) => {
      state.specialists.filters = action.payload;
      state.specialists.page = 1;
      state.specialists.hasMore = true;
    },
    clearSpecialists: (state) => {
      state.specialists.list = [];
      state.specialists.page = 1;
      state.specialists.hasMore = true;
    },
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentUser) {
        state.currentUser[field] = value;
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
      }
    },
    setOnlineStatus: (state, action) => {
      if (state.currentUser) {
        state.currentUser.isOnline = action.payload;
        state.currentUser.lastSeen = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user || action.payload;
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.currentUser = { ...state.currentUser, ...action.payload.user };
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
        toast.success("Profil muvaffaqiyatli yangilandi");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.currentUser) {
          state.currentUser.profileImage = action.payload.imageUrl;
        }
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
        toast.success("Profil rasmi yuklandi");
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Upload Cover Image
      .addCase(uploadCoverImage.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.currentUser) {
          state.currentUser.coverImage = action.payload.imageUrl;
        }
        toast.success("Cover rasm yuklandi");
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Upload Gallery
      .addCase(uploadGallery.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadGallery.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.currentUser) {
          state.currentUser.gallery = action.payload.gallery;
        }
        toast.success("Galeriya rasmlari yuklandi");
      })
      .addCase(uploadGallery.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.categories = action.payload.categories;
        }
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
        toast.success("Kategoriya qo'shildi");
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Experience
      .addCase(addExperience.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.experience = state.currentUser.experience || [];
          state.currentUser.experience.push(action.payload.experience);
        }
        state.profileCompletion = calculateProfileCompletion(state.currentUser);
        toast.success("Tajriba qo'shildi");
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Education
      .addCase(addEducation.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.education = state.currentUser.education || [];
          state.currentUser.education.push(action.payload.education);
        }
        toast.success("Ta'lim ma'lumotlari qo'shildi");
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Service
      .addCase(addService.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.services = state.currentUser.services || [];
          state.currentUser.services.push(action.payload.service);
        }
        toast.success("Xizmat qo'shildi");
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update Availability
      .addCase(updateAvailability.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.availability = action.payload.availability;
        }
        toast.success("Mavjudlik yangilandi");
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.isOnline = action.payload.isOnline;
          state.currentUser.lastSeen = new Date().toISOString();
        }
      })

      // Search Specialists
      .addCase(searchSpecialists.pending, (state) => {
        state.specialists.loading = true;
        state.error = null;
      })
      .addCase(searchSpecialists.fulfilled, (state, action) => {
        state.specialists.loading = false;
        const { data, page, isNewSearch } = action.payload;

        if (isNewSearch) {
          state.specialists.list = data.specialists;
        } else {
          state.specialists.list.push(...data.specialists);
        }

        state.specialists.page = page;
        state.specialists.hasMore =
          data.pagination.current < data.pagination.pages;
      })
      .addCase(searchSpecialists.rejected, (state, action) => {
        state.specialists.loading = false;
        state.error = action.payload;
      })

      // Get Specialist Detail
      .addCase(getSpecialistDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpecialistDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.specialist;
      })
      .addCase(getSpecialistDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  clearError,
  setSpecialistFilters,
  clearSpecialists,
  updateUserField,
  setOnlineStatus,
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserUpdating = (state) => state.user.updating;
export const selectUserUploading = (state) => state.user.uploading;
export const selectUserError = (state) => state.user.error;
export const selectProfileCompletion = (state) => state.user.profileCompletion;
export const selectSpecialists = (state) => state.user.specialists.list;
export const selectSpecialistsLoading = (state) =>
  state.user.specialists.loading;
export const selectSpecialistsHasMore = (state) =>
  state.user.specialists.hasMore;
export const selectSpecialistsFilters = (state) =>
  state.user.specialists.filters;
export const selectUserProfile = (state) => state.user.profile;
export const selectUserStats = (state) => state.user.stats;

export default userSlice.reducer;

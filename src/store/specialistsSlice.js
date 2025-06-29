import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersAPI, categoriesAPI } from "../services/api";

// Initial state
const initialState = {
  // Search results
  searchResults: {
    specialists: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    total: 0,
    filters: {
      q: "",
      category: "",
      city: "",
      minRating: 0,
      maxPrice: null,
      minPrice: null,
      minExperience: 0,
      skillLevel: "",
      isOnline: false,
      hasPortfolio: false,
      sortBy: "rating",
    },
  },

  // Featured specialists
  featured: {
    list: [],
    loading: false,
    error: null,
  },

  // Categories
  categories: {
    list: [],
    trending: [],
    popular: [],
    loading: false,
    error: null,
  },

  // Current specialist
  currentSpecialist: {
    data: null,
    loading: false,
    error: null,
    reviews: [],
    portfolio: [],
    similar: [],
  },

  // Filters state
  activeFilters: {},
  searchHistory: [],
};

// Async thunks
export const searchSpecialists = createAsyncThunk(
  "specialists/search",
  async (searchParams, { rejectWithValue, getState }) => {
    try {
      const { specialists } = getState();
      const { page = 1, loadMore = false, ...filters } = searchParams;

      const params = {
        page,
        limit: 20,
        ...filters,
      };

      const response = await usersAPI.searchSpecialists(params);

      return {
        data: response.data,
        page,
        loadMore,
        filters,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Qidirishda xato"
      );
    }
  }
);

export const getSpecialistDetail = createAsyncThunk(
  "specialists/getDetail",
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

export const getFeaturedSpecialists = createAsyncThunk(
  "specialists/getFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.searchSpecialists({
        limit: 10,
        sortBy: "popular",
        verified: true,
      });
      return response.data.specialists;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Mashhur mutaxassislarni olishda xato"
      );
    }
  }
);

export const getCategories = createAsyncThunk(
  "specialists/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const [categoriesRes, trendingRes, popularRes] = await Promise.all([
        categoriesAPI.getCategories({ withStats: true }),
        categoriesAPI.getTrendingCategories(),
        categoriesAPI.getPopularCategories(),
      ]);

      return {
        categories: categoriesRes.data.categories,
        trending: trendingRes.data.categories,
        popular: popularRes.data.categories,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kategoriyalarni olishda xato"
      );
    }
  }
);

export const getSimilarSpecialists = createAsyncThunk(
  "specialists/getSimilar",
  async ({ specialistId, categoryId, city }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.searchSpecialists({
        category: categoryId,
        city,
        limit: 4,
        exclude: specialistId,
      });
      return response.data.specialists;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "O'xshash mutaxassislarni olishda xato"
      );
    }
  }
);

// Specialists slice
const specialistsSlice = createSlice({
  name: "specialists",
  initialState,
  reducers: {
    // Search actions
    setSearchFilters: (state, action) => {
      state.searchResults.filters = {
        ...state.searchResults.filters,
        ...action.payload,
      };
      state.searchResults.page = 1;
      state.searchResults.hasMore = true;
    },

    clearSearchResults: (state) => {
      state.searchResults.specialists = [];
      state.searchResults.page = 1;
      state.searchResults.hasMore = true;
      state.searchResults.total = 0;
    },

    resetSearchFilters: (state) => {
      state.searchResults.filters = initialState.searchResults.filters;
      state.searchResults.page = 1;
      state.searchResults.hasMore = true;
    },

    addToSearchHistory: (state, action) => {
      const query = action.payload;
      if (query && query.trim()) {
        state.searchHistory = [
          query,
          ...state.searchHistory.filter((item) => item !== query),
        ].slice(0, 10); // Keep only last 10 searches
      }
    },

    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    // Current specialist actions
    clearCurrentSpecialist: (state) => {
      state.currentSpecialist = initialState.currentSpecialist;
    },

    updateSpecialistRating: (state, action) => {
      const { specialistId, rating } = action.payload;

      // Update in search results
      const searchIndex = state.searchResults.specialists.findIndex(
        (s) => s.id === specialistId
      );
      if (searchIndex !== -1) {
        state.searchResults.specialists[searchIndex].rating = rating;
      }

      // Update in featured
      const featuredIndex = state.featured.list.findIndex(
        (s) => s.id === specialistId
      );
      if (featuredIndex !== -1) {
        state.featured.list[featuredIndex].rating = rating;
      }

      // Update current specialist
      if (state.currentSpecialist.data?.id === specialistId) {
        state.currentSpecialist.data.rating = rating;
      }
    },

    // Active filters
    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },

    clearActiveFilters: (state) => {
      state.activeFilters = {};
    },

    // Error handling
    clearErrors: (state) => {
      state.searchResults.error = null;
      state.featured.error = null;
      state.categories.error = null;
      state.currentSpecialist.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Search Specialists
      .addCase(searchSpecialists.pending, (state, action) => {
        state.searchResults.loading = true;
        state.searchResults.error = null;

        // If it's a new search (not load more), clear current results
        if (!action.meta.arg.loadMore) {
          state.searchResults.specialists = [];
        }
      })
      .addCase(searchSpecialists.fulfilled, (state, action) => {
        state.searchResults.loading = false;
        const { data, page, loadMore, filters } = action.payload;

        if (loadMore) {
          // Append new results
          state.searchResults.specialists.push(...data.specialists);
        } else {
          // Replace results
          state.searchResults.specialists = data.specialists;
        }

        state.searchResults.page = page;
        state.searchResults.total = data.pagination.total;
        state.searchResults.hasMore =
          data.pagination.current < data.pagination.pages;
        state.searchResults.filters = {
          ...state.searchResults.filters,
          ...filters,
        };

        // Add to search history if there's a search query
        if (filters.q) {
          const query = filters.q.trim();
          if (query) {
            state.searchHistory = [
              query,
              ...state.searchHistory.filter((item) => item !== query),
            ].slice(0, 10);
          }
        }
      })
      .addCase(searchSpecialists.rejected, (state, action) => {
        state.searchResults.loading = false;
        state.searchResults.error = action.payload;
      })

      // Get Specialist Detail
      .addCase(getSpecialistDetail.pending, (state) => {
        state.currentSpecialist.loading = true;
        state.currentSpecialist.error = null;
      })
      .addCase(getSpecialistDetail.fulfilled, (state, action) => {
        state.currentSpecialist.loading = false;
        state.currentSpecialist.data = action.payload.specialist;
        state.currentSpecialist.reviews = action.payload.recentReviews || [];
        state.currentSpecialist.similar =
          action.payload.similarSpecialists || [];
      })
      .addCase(getSpecialistDetail.rejected, (state, action) => {
        state.currentSpecialist.loading = false;
        state.currentSpecialist.error = action.payload;
      })

      // Get Featured Specialists
      .addCase(getFeaturedSpecialists.pending, (state) => {
        state.featured.loading = true;
        state.featured.error = null;
      })
      .addCase(getFeaturedSpecialists.fulfilled, (state, action) => {
        state.featured.loading = false;
        state.featured.list = action.payload;
      })
      .addCase(getFeaturedSpecialists.rejected, (state, action) => {
        state.featured.loading = false;
        state.featured.error = action.payload;
      })

      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.list = action.payload.categories;
        state.categories.trending = action.payload.trending;
        state.categories.popular = action.payload.popular;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // Get Similar Specialists
      .addCase(getSimilarSpecialists.fulfilled, (state, action) => {
        state.currentSpecialist.similar = action.payload;
      })
      .addCase(getSimilarSpecialists.rejected, (state, action) => {
        console.error("Similar specialists error:", action.payload);
      });
  },
});

// Actions
export const {
  setSearchFilters,
  clearSearchResults,
  resetSearchFilters,
  addToSearchHistory,
  clearSearchHistory,
  clearCurrentSpecialist,
  updateSpecialistRating,
  setActiveFilters,
  clearActiveFilters,
  clearErrors,
} = specialistsSlice.actions;

// Selectors
export const selectSearchResults = (state) =>
  state.specialists.searchResults.specialists;
export const selectSearchLoading = (state) =>
  state.specialists.searchResults.loading;
export const selectSearchError = (state) =>
  state.specialists.searchResults.error;
export const selectSearchHasMore = (state) =>
  state.specialists.searchResults.hasMore;
export const selectSearchFilters = (state) =>
  state.specialists.searchResults.filters;
export const selectSearchTotal = (state) =>
  state.specialists.searchResults.total;

export const selectFeaturedSpecialists = (state) =>
  state.specialists.featured.list;
export const selectFeaturedLoading = (state) =>
  state.specialists.featured.loading;
export const selectFeaturedError = (state) => state.specialists.featured.error;

export const selectCategories = (state) => state.specialists.categories.list;
export const selectTrendingCategories = (state) =>
  state.specialists.categories.trending;
export const selectPopularCategories = (state) =>
  state.specialists.categories.popular;
export const selectCategoriesLoading = (state) =>
  state.specialists.categories.loading;
export const selectCategoriesError = (state) =>
  state.specialists.categories.error;

export const selectCurrentSpecialist = (state) =>
  state.specialists.currentSpecialist.data;
export const selectCurrentSpecialistLoading = (state) =>
  state.specialists.currentSpecialist.loading;
export const selectCurrentSpecialistError = (state) =>
  state.specialists.currentSpecialist.error;
export const selectCurrentSpecialistReviews = (state) =>
  state.specialists.currentSpecialist.reviews;
export const selectSimilarSpecialists = (state) =>
  state.specialists.currentSpecialist.similar;

export const selectActiveFilters = (state) => state.specialists.activeFilters;
export const selectSearchHistory = (state) => state.specialists.searchHistory;

// Complex selectors
export const selectFilteredSpecialists = (state) => {
  const specialists = state.specialists.searchResults.specialists;
  const filters = state.specialists.activeFilters;

  if (Object.keys(filters).length === 0) return specialists;

  return specialists.filter((specialist) => {
    // Apply local filters
    if (filters.minRating && specialist.rating < filters.minRating)
      return false;
    if (filters.maxPrice && specialist.price > filters.maxPrice) return false;
    if (filters.minPrice && specialist.price < filters.minPrice) return false;
    if (filters.isOnline && !specialist.online) return false;
    if (
      filters.hasPortfolio &&
      (!specialist.portfolio || specialist.portfolio.length === 0)
    )
      return false;

    return true;
  });
};

export const selectSpecialistsByCategory = (state) => {
  const specialists = state.specialists.searchResults.specialists;
  const categories = state.specialists.categories.list;

  return categories.reduce((acc, category) => {
    acc[category.slug] = specialists.filter((specialist) =>
      specialist.categories?.some((cat) => cat.category === category.id)
    );
    return acc;
  }, {});
};

export default specialistsSlice.reducer;

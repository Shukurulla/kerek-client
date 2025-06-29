import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesAPI } from "../services/api";
import { toast } from "react-hot-toast";

// Initial state
const initialState = {
  // All categories
  categories: {
    list: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    total: 0,
  },

  // Featured categories
  featured: {
    list: [],
    loading: false,
    error: null,
  },

  // Trending categories
  trending: {
    list: [],
    loading: false,
    error: null,
  },

  // Popular categories
  popular: {
    list: [],
    loading: false,
    error: null,
  },

  // Current category detail
  currentCategory: {
    data: null,
    subcategories: [],
    specialists: [],
    loading: false,
    error: null,
  },

  // Search
  search: {
    results: [],
    query: "",
    loading: false,
    error: null,
  },

  // Filters
  filters: {
    sortBy: "name",
    orderBy: "asc",
    withStats: true,
  },
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { categories } = getState();
      const { page = 1, loadMore = false, ...otherParams } = params;

      const requestParams = {
        page,
        limit: 20,
        ...categories.filters,
        ...otherParams,
      };

      const response = await categoriesAPI.getCategories(requestParams);

      return {
        data: response.data,
        page,
        loadMore,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kategoriyalarni olishda xato"
      );
    }
  }
);

export const fetchFeaturedCategories = createAsyncThunk(
  "categories/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getFeaturedCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Mashhur kategoriyalarni olishda xato"
      );
    }
  }
);

export const fetchTrendingCategories = createAsyncThunk(
  "categories/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getTrendingCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Trend kategoriyalarni olishda xato"
      );
    }
  }
);

export const fetchPopularCategories = createAsyncThunk(
  "categories/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getPopularCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ommabop kategoriyalarni olishda xato"
      );
    }
  }
);

export const fetchCategoryDetail = createAsyncThunk(
  "categories/fetchCategoryDetail",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategoryDetail(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Kategoriya ma'lumotlarini olishda xato"
      );
    }
  }
);

export const fetchSubcategories = createAsyncThunk(
  "categories/fetchSubcategories",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getSubcategories(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Subkategoriyalarni olishda xato"
      );
    }
  }
);

export const searchCategories = createAsyncThunk(
  "categories/searchCategories",
  async (query, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.searchCategories(query);
      return {
        results: response.data,
        query,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Qidirishda xato"
      );
    }
  }
);

export const fetchAllCategoriesData = createAsyncThunk(
  "categories/fetchAllData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Fetch all category data in parallel
      const results = await Promise.allSettled([
        dispatch(fetchCategories()).unwrap(),
        dispatch(fetchFeaturedCategories()).unwrap(),
        dispatch(fetchTrendingCategories()).unwrap(),
        dispatch(fetchPopularCategories()).unwrap(),
      ]);

      // Check if any requests failed
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        console.warn("Some category requests failed:", failures);
      }

      return true;
    } catch (error) {
      return rejectWithValue("Ma'lumotlarni olishda xato");
    }
  }
);

// Categories slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.categories.page = 1;
      state.categories.hasMore = true;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.categories.page = 1;
      state.categories.hasMore = true;
    },

    // Search actions
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },

    clearSearchResults: (state) => {
      state.search.results = [];
      state.search.query = "";
      state.search.error = null;
    },

    // Current category actions
    clearCurrentCategory: (state) => {
      state.currentCategory = initialState.currentCategory;
    },

    // Categories list actions
    clearCategories: (state) => {
      state.categories.list = [];
      state.categories.page = 1;
      state.categories.hasMore = true;
      state.categories.total = 0;
    },

    // Error handling
    clearErrors: (state) => {
      state.categories.error = null;
      state.featured.error = null;
      state.trending.error = null;
      state.popular.error = null;
      state.currentCategory.error = null;
      state.search.error = null;
    },

    // Update category stats (for real-time updates)
    updateCategoryStats: (state, action) => {
      const { categoryId, stats } = action.payload;

      // Update in main categories list
      const categoryIndex = state.categories.list.findIndex(
        (cat) => cat.id === categoryId
      );
      if (categoryIndex !== -1) {
        state.categories.list[categoryIndex] = {
          ...state.categories.list[categoryIndex],
          ...stats,
        };
      }

      // Update in featured list
      const featuredIndex = state.featured.list.findIndex(
        (cat) => cat.id === categoryId
      );
      if (featuredIndex !== -1) {
        state.featured.list[featuredIndex] = {
          ...state.featured.list[featuredIndex],
          ...stats,
        };
      }

      // Update in trending list
      const trendingIndex = state.trending.list.findIndex(
        (cat) => cat.id === categoryId
      );
      if (trendingIndex !== -1) {
        state.trending.list[trendingIndex] = {
          ...state.trending.list[trendingIndex],
          ...stats,
        };
      }

      // Update in popular list
      const popularIndex = state.popular.list.findIndex(
        (cat) => cat.id === categoryId
      );
      if (popularIndex !== -1) {
        state.popular.list[popularIndex] = {
          ...state.popular.list[popularIndex],
          ...stats,
        };
      }

      // Update current category if it matches
      if (state.currentCategory.data?.id === categoryId) {
        state.currentCategory.data = {
          ...state.currentCategory.data,
          ...stats,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state, action) => {
        state.categories.loading = true;
        state.categories.error = null;

        // If it's not a load more request, clear current list
        if (!action.meta.arg?.loadMore) {
          state.categories.list = [];
        }
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        const { data, page, loadMore } = action.payload;

        if (loadMore) {
          // Append new categories
          state.categories.list.push(...(data.categories || data));
        } else {
          // Replace categories
          state.categories.list = data.categories || data;
        }

        state.categories.page = page;
        state.categories.total = data.pagination?.total || data.length;
        state.categories.hasMore =
          data.pagination?.current < data.pagination?.pages || false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch Featured Categories
      .addCase(fetchFeaturedCategories.pending, (state) => {
        state.featured.loading = true;
        state.featured.error = null;
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.featured.loading = false;
        state.featured.list = action.payload.categories || action.payload;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.featured.loading = false;
        state.featured.error = action.payload;
      })

      // Fetch Trending Categories
      .addCase(fetchTrendingCategories.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingCategories.fulfilled, (state, action) => {
        state.trending.loading = false;
        state.trending.list = action.payload.categories || action.payload;
      })
      .addCase(fetchTrendingCategories.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload;
      })

      // Fetch Popular Categories
      .addCase(fetchPopularCategories.pending, (state) => {
        state.popular.loading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularCategories.fulfilled, (state, action) => {
        state.popular.loading = false;
        state.popular.list = action.payload.categories || action.payload;
      })
      .addCase(fetchPopularCategories.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.payload;
      })

      // Fetch Category Detail
      .addCase(fetchCategoryDetail.pending, (state) => {
        state.currentCategory.loading = true;
        state.currentCategory.error = null;
      })
      .addCase(fetchCategoryDetail.fulfilled, (state, action) => {
        state.currentCategory.loading = false;
        state.currentCategory.data = action.payload.category || action.payload;
        state.currentCategory.specialists = action.payload.specialists || [];
      })
      .addCase(fetchCategoryDetail.rejected, (state, action) => {
        state.currentCategory.loading = false;
        state.currentCategory.error = action.payload;
        toast.error(action.payload);
      })

      // Fetch Subcategories
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.currentCategory.subcategories =
          action.payload.subcategories || action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        console.error("Subcategories error:", action.payload);
      })

      // Search Categories
      .addCase(searchCategories.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.results = action.payload.results;
        state.search.query = action.payload.query;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload;
      })

      // Fetch All Categories Data
      .addCase(fetchAllCategoriesData.pending, (state) => {
        // Individual loading states are handled by their respective actions
      })
      .addCase(fetchAllCategoriesData.fulfilled, (state) => {
        // Success is handled by individual actions
      })
      .addCase(fetchAllCategoriesData.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

// Actions
export const {
  setFilters,
  resetFilters,
  setSearchQuery,
  clearSearchResults,
  clearCurrentCategory,
  clearCategories,
  clearErrors,
  updateCategoryStats,
} = categoriesSlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.categories.list;
export const selectCategoriesLoading = (state) =>
  state.categories.categories.loading;
export const selectCategoriesError = (state) =>
  state.categories.categories.error;
export const selectCategoriesHasMore = (state) =>
  state.categories.categories.hasMore;
export const selectCategoriesTotal = (state) =>
  state.categories.categories.total;

export const selectFeaturedCategories = (state) =>
  state.categories.featured.list;
export const selectFeaturedLoading = (state) =>
  state.categories.featured.loading;
export const selectFeaturedError = (state) => state.categories.featured.error;

export const selectTrendingCategories = (state) =>
  state.categories.trending.list;
export const selectTrendingLoading = (state) =>
  state.categories.trending.loading;
export const selectTrendingError = (state) => state.categories.trending.error;

export const selectPopularCategories = (state) => state.categories.popular.list;
export const selectPopularLoading = (state) => state.categories.popular.loading;
export const selectPopularError = (state) => state.categories.popular.error;

export const selectCurrentCategory = (state) =>
  state.categories.currentCategory.data;
export const selectCurrentCategoryLoading = (state) =>
  state.categories.currentCategory.loading;
export const selectCurrentCategoryError = (state) =>
  state.categories.currentCategory.error;
export const selectCurrentCategorySubcategories = (state) =>
  state.categories.currentCategory.subcategories;
export const selectCurrentCategorySpecialists = (state) =>
  state.categories.currentCategory.specialists;

export const selectSearchResults = (state) => state.categories.search.results;
export const selectSearchQuery = (state) => state.categories.search.query;
export const selectSearchLoading = (state) => state.categories.search.loading;
export const selectSearchError = (state) => state.categories.search.error;

export const selectCategoriesFilters = (state) => state.categories.filters;

// Complex selectors
export const selectCategoriesByType = (state) => {
  return {
    all: state.categories.categories.list,
    featured: state.categories.featured.list,
    trending: state.categories.trending.list,
    popular: state.categories.popular.list,
  };
};

export const selectCategoryById = (categoryId) => (state) => {
  const allCategories = [
    ...state.categories.categories.list,
    ...state.categories.featured.list,
    ...state.categories.trending.list,
    ...state.categories.popular.list,
  ];

  return allCategories.find((category) => category.id === categoryId);
};

export const selectCategoryBySlug = (slug) => (state) => {
  const allCategories = [
    ...state.categories.categories.list,
    ...state.categories.featured.list,
    ...state.categories.trending.list,
    ...state.categories.popular.list,
  ];

  return allCategories.find((category) => category.slug === slug);
};

export const selectIsAnyCategoryLoading = (state) => {
  return (
    state.categories.categories.loading ||
    state.categories.featured.loading ||
    state.categories.trending.loading ||
    state.categories.popular.loading ||
    state.categories.currentCategory.loading ||
    state.categories.search.loading
  );
};

export default categoriesSlice.reducer;

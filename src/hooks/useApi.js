import { useState, useCallback, useRef, useEffect } from "react";
import { apiClient, handleApiError } from "../services/api";
import { toast } from "react-hot-toast";

// Custom hook for API calls with loading states and error handling
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const call = useCallback(async (apiFunction, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage = "Muvaffaqiyatli bajarildi",
      onSuccess,
      onError,
      transform = (data) => data,
    } = options;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await apiFunction({
        signal: abortControllerRef.current.signal,
      });

      const transformedData = transform(response.data);

      if (showSuccess) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(transformedData);
      }

      return transformedData;
    } catch (err) {
      // Don't handle aborted requests
      if (err.name === "AbortError") {
        return;
      }

      const errorInfo = handleApiError(err);
      setError(errorInfo);

      if (showError) {
        toast.error(errorInfo.message);
      }

      if (onError) {
        onError(errorInfo);
      }

      throw errorInfo;
    } finally {
      if (showLoading) setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    loading,
    error,
    call,
    clearError,
    cancel,
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const {
    pageSize = 20,
    resetOnParamsChange = true,
    transform = (data) => data,
    initialLoad = true,
  } = options;

  const abortControllerRef = useRef(null);
  const paramsRef = useRef({});

  const load = useCallback(
    async (params = {}, loadMore = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const currentPage = loadMore ? page + 1 : 1;

        const response = await apiFunction({
          ...params,
          page: currentPage,
          limit: pageSize,
          signal: abortControllerRef.current.signal,
        });

        const transformedData = transform(response.data);
        const items =
          transformedData.items || transformedData.data || transformedData;
        const pagination = transformedData.pagination || {};

        if (loadMore) {
          setData((prev) => [...prev, ...items]);
          setPage(currentPage);
        } else {
          setData(items);
          setPage(1);
        }

        setTotal(pagination.total || items.length);
        setHasMore(
          pagination.current < pagination.pages ||
            (pagination.hasMore !== undefined
              ? pagination.hasMore
              : items.length === pageSize)
        );

        paramsRef.current = params;
      } catch (err) {
        if (err.name !== "AbortError") {
          const errorInfo = handleApiError(err);
          setError(errorInfo);
          toast.error(errorInfo.message);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiFunction, page, pageSize, transform]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      load(paramsRef.current, true);
    }
  }, [load, loading, hasMore]);

  const refresh = useCallback(() => {
    load(paramsRef.current, false);
  }, [load]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    total,
    load,
    loadMore,
    refresh,
    reset,
  };
};

// Hook for single resource with CRUD operations
export const useResource = (resourceApi, options = {}) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const { transform = (data) => data, onSuccess, onError } = options;

  const abortControllerRef = useRef(null);

  const get = useCallback(
    async (id) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await resourceApi.get(id, {
          signal: abortControllerRef.current.signal,
        });

        const transformedData = transform(response.data);
        setItem(transformedData);

        if (onSuccess) {
          onSuccess(transformedData);
        }

        return transformedData;
      } catch (err) {
        if (err.name !== "AbortError") {
          const errorInfo = handleApiError(err);
          setError(errorInfo);

          if (onError) {
            onError(errorInfo);
          }

          throw errorInfo;
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [resourceApi, transform, onSuccess, onError]
  );

  const create = useCallback(
    async (data) => {
      try {
        setSaving(true);
        setError(null);

        const response = await resourceApi.create(data);
        const transformedData = transform(response.data);

        setItem(transformedData);
        toast.success("Muvaffaqiyatli yaratildi");

        if (onSuccess) {
          onSuccess(transformedData);
        }

        return transformedData;
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        toast.error(errorInfo.message);

        if (onError) {
          onError(errorInfo);
        }

        throw errorInfo;
      } finally {
        setSaving(false);
      }
    },
    [resourceApi, transform, onSuccess, onError]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        setSaving(true);
        setError(null);

        const response = await resourceApi.update(id, data);
        const transformedData = transform(response.data);

        setItem(transformedData);
        toast.success("Muvaffaqiyatli yangilandi");

        if (onSuccess) {
          onSuccess(transformedData);
        }

        return transformedData;
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        toast.error(errorInfo.message);

        if (onError) {
          onError(errorInfo);
        }

        throw errorInfo;
      } finally {
        setSaving(false);
      }
    },
    [resourceApi, transform, onSuccess, onError]
  );

  const remove = useCallback(
    async (id) => {
      try {
        setDeleting(true);
        setError(null);

        await resourceApi.delete(id);

        setItem(null);
        toast.success("Muvaffaqiyatli o'chirildi");

        if (onSuccess) {
          onSuccess(null);
        }

        return true;
      } catch (err) {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        toast.error(errorInfo.message);

        if (onError) {
          onError(errorInfo);
        }

        throw errorInfo;
      } finally {
        setDeleting(false);
      }
    },
    [resourceApi, onSuccess, onError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setItem(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    item,
    loading,
    saving,
    deleting,
    error,
    get,
    create,
    update,
    remove,
    clearError,
    reset,
  };
};

// Hook for file uploads with progress
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const upload = useCallback(async (apiFunction, file, options = {}) => {
    const {
      onProgress,
      onSuccess,
      onError,
      showSuccess = true,
      successMessage = "Fayl muvaffaqiyatli yuklandi",
    } = options;

    // Cancel previous upload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiFunction(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);

        if (onProgress) {
          onProgress(percentCompleted);
        }
      });

      if (showSuccess) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      if (err.name !== "AbortError") {
        const errorInfo = handleApiError(err);
        setError(errorInfo);
        toast.error(errorInfo.message);

        if (onError) {
          onError(errorInfo);
        }

        throw errorInfo;
      }
    } finally {
      setUploading(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    uploading,
    progress,
    error,
    upload,
    cancel,
    clearError,
  };
};

// Hook for optimistic updates
export const useOptimisticApi = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousDataRef = useRef(null);

  const optimisticUpdate = useCallback(
    async (optimisticData, apiFunction, options = {}) => {
      const { onSuccess, onError, showError = true } = options;

      // Store previous data for rollback
      previousDataRef.current = data;

      // Apply optimistic update
      setData(optimisticData);
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction();
        const actualData = response.data;

        // Update with actual data from server
        setData(actualData);

        if (onSuccess) {
          onSuccess(actualData);
        }

        return actualData;
      } catch (err) {
        // Rollback on error
        setData(previousDataRef.current);

        const errorInfo = handleApiError(err);
        setError(errorInfo);

        if (showError) {
          toast.error(errorInfo.message);
        }

        if (onError) {
          onError(errorInfo);
        }

        throw errorInfo;
      } finally {
        setLoading(false);
        previousDataRef.current = null;
      }
    },
    [data]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    optimisticUpdate,
    clearError,
    reset,
    setData,
  };
};

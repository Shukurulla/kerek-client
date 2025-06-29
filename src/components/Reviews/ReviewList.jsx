import React, { useState, useEffect } from "react";
import { Filter, SortDesc, Star, TrendingUp } from "lucide-react";
import ReviewCard from "./ReviewCard";
import Button from "../UI/Button";
import Loading from "../UI/Loading";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

const ReviewList = ({
  specialistId,
  showSpecialist = false,
  showClient = true,
  enableFilters = true,
  limit = 10,
}) => {
  const { request } = useApi();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    sortBy: "createdAt",
    order: "desc",
    rating: "",
    category: "",
    hasMedia: false,
    hasResponse: false,
  });

  const sortOptions = [
    { value: "createdAt", label: "Yangi" },
    { value: "rating", label: "Reyting" },
    { value: "helpful", label: "Foydali" },
  ];

  const ratingFilters = [
    { value: "", label: "Barcha reytinglar" },
    { value: "5", label: "5 yulduz" },
    { value: "4", label: "4+ yulduz" },
    { value: "3", label: "3+ yulduz" },
    { value: "2", label: "2+ yulduz" },
    { value: "1", label: "1+ yulduz" },
  ];

  useEffect(() => {
    fetchReviews(1, true);
  }, [specialistId, filters]);

  const fetchReviews = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: pageNum,
        limit,
        sortBy: filters.sortBy,
        order: filters.order,
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.category && { category: filters.category }),
        ...(filters.hasMedia && { hasMedia: "true" }),
        ...(filters.hasResponse && { hasResponse: "true" }),
      });

      const endpoint = specialistId
        ? `/reviews/specialist/${specialistId}?${params}`
        : `/reviews/my-reviews?${params}`;

      const response = await request(endpoint);

      if (reset || pageNum === 1) {
        setReviews(response.reviews);
        setStatistics(response.statistics);
      } else {
        setReviews((prev) => [...prev, ...response.reviews]);
      }

      setHasMore(response.pagination.current < response.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      showToast("Baholashlarni yuklashda xato", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchReviews(page + 1);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Baholashni o'chirishni xohlaysizmi?")) return;

    try {
      await request(`/reviews/${reviewId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      showToast("Baholash o'chirildi", "success");
    } catch (error) {
      showToast("Baholashni o'chirishda xato", "error");
    }
  };

  const handleUpdateReview = () => {
    // Refresh reviews after update
    fetchReviews(1, true);
  };

  const StatisticsCard = () => {
    if (!statistics || !specialistId) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Baholash statistikasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {statistics.averageOverall || 0}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(statistics.averageOverall || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {statistics.totalReviews} baholash
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                statistics.breakdown?.[
                  rating === 5
                    ? "five"
                    : rating === 4
                    ? "four"
                    : rating === 3
                    ? "three"
                    : rating === 2
                    ? "two"
                    : "one"
                ] || 0;
              const percentage =
                statistics.totalReviews > 0
                  ? ((count / statistics.totalReviews) * 100).toFixed(1)
                  : 0;

              return (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Batafsil</h4>
            {[
              { key: "averageQuality", label: "Sifat" },
              { key: "averageCommunication", label: "Muloqot" },
              { key: "averageTimeliness", label: "Vaqt" },
              { key: "averageProfessionalism", label: "Professional" },
            ].map(({ key, label }) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600">{label}:</span>
                <div className="flex items-center">
                  <span className="font-medium mr-1">
                    {statistics[key]?.toFixed(1) || 0}
                  </span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
              </div>
            ))}
          </div>

          {/* Trends */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Trend</h4>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Yaxshilanmoqda</span>
            </div>
            <div className="text-xs text-gray-500">
              So'nggi oy ichida reyting o'sdi
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <StatisticsCard />

      {/* Filters */}
      {enableFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              Baholashlar ({reviews.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtr
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saralash
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reyting
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {ratingFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Filters */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Qo'shimcha
                </label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasMedia}
                      onChange={(e) =>
                        handleFilterChange("hasMedia", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Rasmli</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasResponse}
                      onChange={(e) =>
                        handleFilterChange("hasResponse", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Javobli</span>
                  </label>
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tartib
                </label>
                <select
                  value={filters.order}
                  onChange={(e) => handleFilterChange("order", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Kamayish</option>
                  <option value="asc">O'sish</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showSpecialist={showSpecialist}
              showClient={showClient}
              onUpdate={handleUpdateReview}
              onDelete={handleDeleteReview}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hozircha baholashlar yo'q
            </h3>
            <p className="text-gray-500">
              {specialistId
                ? "Bu mutaxassis hali baholanmagan"
                : "Siz hali hech kim baholamagansiz"}
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Yuklanmoqda...
              </div>
            ) : (
              "Ko'proq yuklash"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;

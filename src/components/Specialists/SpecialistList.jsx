import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  List,
  Filter,
  SortAsc,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { fetchSpecialists, setFilters } from "../../store/specialistsSlice";
import SpecialistCard from "./SpecialistCard";
import SearchFilters from "./SearchFilters";
import Button from "../UI/Button";
import Loading from "../UI/Loading";

const SpecialistList = ({ initialFilters = {} }) => {
  const dispatch = useDispatch();
  const { specialists, loading, error, pagination, filters } = useSelector(
    (state) => state.specialists
  );

  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    // Set initial filters
    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilters(initialFilters));
    }

    // Fetch specialists
    dispatch(
      fetchSpecialists({
        ...filters,
        ...initialFilters,
        sortBy,
        page: 1,
      })
    );
  }, [dispatch, sortBy]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(
      fetchSpecialists({
        ...newFilters,
        sortBy,
        page: 1,
      })
    );
  };

  const handleLoadMore = () => {
    if (!loading && pagination.hasNext) {
      dispatch(
        fetchSpecialists({
          ...filters,
          sortBy,
          page: pagination.current + 1,
        })
      );
    }
  };

  const handleContact = (specialist) => {
    // Navigate to chat or open contact modal
    console.log("Contact specialist:", specialist);
  };

  const sortOptions = [
    { value: "rating", label: "Reyting bo'yicha" },
    { value: "price_low", label: "Arzon narxdan" },
    { value: "price_high", label: "Qimmat narxdan" },
    { value: "experience", label: "Tajriba bo'yicha" },
    { value: "newest", label: "Yangi qo'shilganlar" },
    { value: "popular", label: "Mashhurlar" },
    { value: "completion_rate", label: "Bajarish darajasi" },
  ];

  if (loading && specialists.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mutaxassislar</h2>
          {pagination.total > 0 && (
            <p className="text-gray-600 mt-1">
              {pagination.total} ta mutaxassis topildi
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`
                p-2 transition-colors
                ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }
              `}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`
                p-2 transition-colors
                ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }
              `}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filters toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-blue-50 border-blue-300" : ""}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtrlar
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>
      )}

      {/* Active filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Kategoriya: {filters.categoryName}</span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.category;
                  delete newFilters.categoryName;
                  handleFilterChange(newFilters);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}

          {filters.city && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Shahar: {filters.city}</span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.city;
                  handleFilterChange(newFilters);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}

          {filters.minRating && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Reyting: {filters.minRating}+ yulduz</span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.minRating;
                  handleFilterChange(newFilters);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}

          {(filters.minPrice || filters.maxPrice) && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>
                Narx: {filters.minPrice || 0} - {filters.maxPrice || "∞"} so'm
              </span>
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.minPrice;
                  delete newFilters.maxPrice;
                  handleFilterChange(newFilters);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}

          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => handleFilterChange({})}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Barchasini tozalash
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              dispatch(fetchSpecialists({ ...filters, sortBy, page: 1 }))
            }
          >
            Qayta urinish
          </Button>
        </div>
      )}

      {/* Results */}
      {specialists.length > 0 ? (
        <>
          {/* Grid/List */}
          <div
            className={`
            ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }
          `}
          >
            {specialists.map((specialist) => (
              <SpecialistCard
                key={specialist._id}
                specialist={specialist}
                variant={viewMode === "list" ? "list" : "default"}
                onContact={handleContact}
              />
            ))}
          </div>

          {/* Load more */}
          {pagination.hasNext && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Yuklanmoqda...
                  </>
                ) : (
                  "Ko'proq ko'rish"
                )}
              </Button>
            </div>
          )}

          {/* Pagination info */}
          <div className="text-center text-sm text-gray-500">
            {specialists.length} / {pagination.total} ta mutaxassis ko'rsatildi
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Mutaxassis topilmadi
            </h3>
            <p className="text-gray-600 mb-4">
              Qidiruv parametrlaringizga mos mutaxassis topilmadi. Filtrlarni
              o'zgartiring.
            </p>
            <Button variant="outline" onClick={() => handleFilterChange({})}>
              Filtrlarni tozalash
            </Button>
          </div>
        )
      )}

      {/* Loading overlay for pagination */}
      {loading && specialists.length > 0 && (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default SpecialistList;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, List, Search, Filter, TrendingUp, Star } from "lucide-react";
import { fetchCategories } from "../../store/categoriesSlice";
import CategoryCard from "./CategoryCard";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Loading from "../UI/Loading";

const CategoryGrid = ({
  variant = "default",
  limit,
  showSearch = true,
  showFilters = true,
}) => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'trending', 'featured', 'popular'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'specialists', 'rating', 'projects'

  useEffect(() => {
    dispatch(
      fetchCategories({
        parentOnly: true,
        withStats: true,
      })
    );
  }, [dispatch]);

  // Filter and sort categories
  const filteredCategories = React.useMemo(() => {
    let filtered = [...categories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.names?.uz
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.names?.ru
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.description?.uz
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    switch (filterType) {
      case "trending":
        filtered = filtered.filter((cat) => cat.trending?.isHot);
        break;
      case "featured":
        filtered = filtered.filter((cat) => cat.trending?.isFeatured);
        break;
      case "popular":
        filtered = filtered.filter((cat) => cat.trending?.isPopular);
        break;
      default:
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "specialists":
          return (
            (b.stats?.activeSpecialistCount || 0) -
            (a.stats?.activeSpecialistCount || 0)
          );
        case "rating":
          return (b.stats?.averageRating || 0) - (a.stats?.averageRating || 0);
        case "projects":
          return (b.stats?.totalProjects || 0) - (a.stats?.totalProjects || 0);
        case "name":
        default:
          return (a.names?.uz || a.name).localeCompare(b.names?.uz || b.name);
      }
    });

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [categories, searchTerm, filterType, sortBy, limit]);

  const handleCategoryClick = (category) => {
    // Handle category selection
    console.log("Selected category:", category);
  };

  if (loading && categories.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(fetchCategories({ parentOnly: true, withStats: true }))
          }
        >
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Xizmat kategoriyalari
          </h2>
          {filteredCategories.length > 0 && (
            <p className="text-gray-600 mt-1">
              {filteredCategories.length} ta kategoriya
            </p>
          )}
        </div>

        {showFilters && (
          <div className="flex items-center space-x-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Nom bo'yicha</option>
              <option value="specialists">Mutaxassislar soni</option>
              <option value="rating">Reyting bo'yicha</option>
              <option value="projects">Loyihalar soni</option>
            </select>

            {/* View mode */}
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
          </div>
        )}
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Kategoriya qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              Barchasi
            </Button>
            <Button
              variant={filterType === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("trending")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trend
            </Button>
            <Button
              variant={filterType === "featured" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("featured")}
            >
              <Star className="w-4 h-4 mr-1" />
              Mashhur
            </Button>
            <Button
              variant={filterType === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("popular")}
            >
              Ommabop
            </Button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div
          className={`
          ${
            viewMode === "grid"
              ? variant === "compact"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        `}
        >
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              variant={viewMode === "list" ? "compact" : variant}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Kategoriya topilmadi
          </h3>
          <p className="text-gray-600 mb-4">
            Qidiruv so'zingizni o'zgartiring yoki filtrlarni tozalang.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
          >
            Filtrlarni tozalash
          </Button>
        </div>
      )}

      {/* Show more */}
      {limit && categories.length > limit && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <a href="/categories">Barcha kategoriyalarni ko'rish</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;

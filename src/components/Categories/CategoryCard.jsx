import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import Badge from "../UI/Badge";

const CategoryCard = ({ category, variant = "default", onClick }) => {
  const {
    _id,
    names,
    slug,
    icon,
    color,
    image,
    description,
    stats,
    trending,
    subcategories,
  } = category;

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  if (variant === "compact") {
    return (
      <Link
        to={`/categories/${slug}`}
        onClick={handleClick}
        className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: color || "#3B82F6" }}
          >
            {image ? (
              <img src={image} alt={names?.uz} className="w-6 h-6" />
            ) : (
              <i className={`fa fa-${icon || "folder"} text-lg`}></i>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {names?.uz || category.name}
            </h3>
            <p className="text-sm text-gray-500">
              {stats?.activeSpecialistCount || 0} mutaxassis
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        to={`/categories/${slug}`}
        onClick={handleClick}
        className="block relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white hover:shadow-xl transition-all duration-300 group"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {image ? (
                <img src={image} alt={names?.uz} className="w-7 h-7" />
              ) : (
                <i className={`fa fa-${icon || "folder"} text-xl`}></i>
              )}
            </div>

            {trending?.isFeatured && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Mashhur
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
            {names?.uz || category.name}
          </h3>

          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {description?.uz}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{stats?.activeSpecialistCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{stats?.averageRating || 0}</span>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/categories/${slug}`}
      onClick={handleClick}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: color || "#3B82F6" }}
          >
            {image ? (
              <img src={image} alt={names?.uz} className="w-8 h-8" />
            ) : (
              <i className={`fa fa-${icon || "folder"} text-2xl`}></i>
            )}
          </div>

          <div className="text-right">
            {trending?.isHot && (
              <Badge variant="destructive" size="sm" className="mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trend
              </Badge>
            )}
            {trending?.isFeatured && (
              <Badge variant="secondary" size="sm">
                Mashhur
              </Badge>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {names?.uz || category.name}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {description?.uz || "Professional xizmatlar"}
        </p>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{stats?.activeSpecialistCount || 0} mutaxassis</span>
          </div>

          {stats?.averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{stats.averageRating.toFixed(1)}</span>
            </div>
          )}

          {stats?.totalProjects > 0 && (
            <div className="text-gray-500">{stats.totalProjects} loyiha</div>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {subcategories.slice(0, 3).map((sub) => (
              <span
                key={sub._id}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {sub.names?.uz || sub.name}
              </span>
            ))}
            {subcategories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{subcategories.length - 3} ko'proq
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {stats?.averagePrice ? (
              <span>{stats.averagePrice.toLocaleString()} so'm dan</span>
            ) : (
              "Bepul konsultatsiya"
            )}
          </div>

          <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Filter,
  X,
  Wifi,
  Award,
  Clock,
  Languages,
} from "lucide-react";
import { CITIES } from "../../utils/constants";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Rating from "../UI/Rating";

const SearchFilters = ({ filters, onFiltersChange }) => {
  const { categories } = useSelector((state) => state.categories);

  const [localFilters, setLocalFilters] = useState({
    q: "",
    category: "",
    city: "",
    minRating: 0,
    maxPrice: "",
    minPrice: "",
    minExperience: 0,
    skillLevel: "",
    isOnline: false,
    hasPortfolio: false,
    hasVerifiedCertificates: false,
    languages: [],
    ...filters,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...filters }));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "number") return value > 0;
        if (typeof value === "boolean") return value;
        return value != null;
      })
    );

    onFiltersChange(cleanFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      q: "",
      category: "",
      city: "",
      minRating: 0,
      maxPrice: "",
      minPrice: "",
      minExperience: 0,
      skillLevel: "",
      isOnline: false,
      hasPortfolio: false,
      hasVerifiedCertificates: false,
      languages: [],
    };
    setLocalFilters(emptyFilters);
    onFiltersChange({});
  };

  const skillLevels = [
    { value: "beginner", label: "Boshlang'ich" },
    { value: "intermediate", label: "O'rta" },
    { value: "advanced", label: "Yuqori" },
    { value: "expert", label: "Ekspert" },
  ];

  const languageOptions = [
    { value: "uzbek", label: "O'zbek tili" },
    { value: "russian", label: "Rus tili" },
    { value: "english", label: "Ingliz tili" },
    { value: "karakalpak", label: "Qoraqalpoq tili" },
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qidiruv
        </label>
        <Input
          type="text"
          placeholder="Mutaxassis nomi, ko'nikma yoki xizmat..."
          value={localFilters.q}
          onChange={(e) => handleFilterChange("q", e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Main filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoriya
          </label>
          <select
            value={localFilters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Barcha kategoriyalar</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.names?.uz || category.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shahar
          </label>
          <select
            value={localFilters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Barcha shaharlar</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimal reyting
          </label>
          <div className="flex items-center space-x-2">
            <Rating
              value={localFilters.minRating}
              onChange={(value) => handleFilterChange("minRating", value)}
              interactive
            />
            <span className="text-sm text-gray-500">
              {localFilters.minRating}+
            </span>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Narx oralig'i (so'm)
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Dan"
              value={localFilters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Gacha"
              value={localFilters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Advanced filters toggle */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span>Qo'shimcha filtrlar</span>
          {showAdvanced ? (
            <X className="w-4 h-4" />
          ) : (
            <span>({Object.keys(filters).length})</span>
          )}
        </button>

        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Tozalash
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            Qo'llash
          </Button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimal tajriba (yil)
              </label>
              <Input
                type="number"
                min="0"
                max="50"
                placeholder="0"
                value={localFilters.minExperience}
                onChange={(e) =>
                  handleFilterChange(
                    "minExperience",
                    parseInt(e.target.value) || 0
                  )
                }
                icon={<Award className="w-5 h-5" />}
              />
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ko'nikma darajasi
              </label>
              <select
                value={localFilters.skillLevel}
                onChange={(e) =>
                  handleFilterChange("skillLevel", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha darajalar</option>
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tillar
              </label>
              <div className="space-y-2">
                {languageOptions.map((lang) => (
                  <label
                    key={lang.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.languages.includes(lang.value)}
                      onChange={(e) => {
                        const languages = e.target.checked
                          ? [...localFilters.languages, lang.value]
                          : localFilters.languages.filter(
                              (l) => l !== lang.value
                            );
                        handleFilterChange("languages", languages);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Boolean filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.isOnline}
                onChange={(e) =>
                  handleFilterChange("isOnline", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  Hozir online
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasPortfolio}
                onChange={(e) =>
                  handleFilterChange("hasPortfolio", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">
                  Portfolio bor
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasVerifiedCertificates}
                onChange={(e) =>
                  handleFilterChange(
                    "hasVerifiedCertificates",
                    e.target.checked
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Tasdiqlangan sertifikat
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

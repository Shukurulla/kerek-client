"use client";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import SpecialistList from "../components/Specialists/SpecialistList";
import { setSearchFilters } from "../store/specialistsSlice";

const SpecialistsPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Get filters from URL params
    const filters = {};
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const q = searchParams.get("q");
    const minRating = searchParams.get("minRating");

    if (category) filters.category = category;
    if (city) filters.city = city;
    if (q) filters.q = q;
    if (minRating) filters.minRating = Number.parseFloat(minRating);

    if (Object.keys(filters).length > 0) {
      dispatch(setSearchFilters(filters));
    }
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Mutaxassislar
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              O'zbekistonning eng yaxshi mutaxassislari bilan tanishing. Sifatli
              xizmat va professional yondashuv kafolati.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SpecialistList />
      </div>
    </div>
  );
};

export default SpecialistsPage;

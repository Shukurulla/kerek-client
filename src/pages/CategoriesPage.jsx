import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users } from "lucide-react";
import CategoryGrid from "../components/Categories/CategoryGrid";
import Button from "../components/UI/Button";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Barcha Xizmat Kategoriyalari
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Har qanday ehtiyojingiz uchun professional mutaxassislarni toping.
              100+ kategoriyada minglab tajribali mutaxassis.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  50+
                </div>
                <div className="text-blue-200">Kategoriya</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  5000+
                </div>
                <div className="text-blue-200">Mutaxassis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  50K+
                </div>
                <div className="text-blue-200">Tugallangan loyiha</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Mashhur Kategoriyalar
              </h2>
              <p className="text-gray-600">
                Eng ko'p qidirilayotgan va talabga ega kategoriyalar
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/specialists">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trend mutaxassislar
              </Link>
            </Button>
          </div>

          <CategoryGrid
            variant="featured"
            limit={6}
            showSearch={false}
            showFilters={false}
          />
        </div>
      </div>

      {/* All Categories */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CategoryGrid />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Mutaxassis bo'lishni istaysizmi?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Platformamizga qo'shiling va o'z xizmatlaringizni minglab
              mijozlarga taklif qiling. Bepul ro'yxatdan o'ting va daromad
              qilishni boshlang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link to="/register?role=specialist">
                  <Users className="w-5 h-5 mr-2" />
                  Mutaxassis bo'lish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-300 hover:bg-gray-800"
              >
                Batafsil ma'lumot
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

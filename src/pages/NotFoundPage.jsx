import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import Button from "../components/UI/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-200 mb-4">404</div>
          <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sahifa topilmadi
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa joyga
            ko'chirilgan.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-8">
          <Button size="lg" className="w-full" asChild>
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Bosh sahifaga qaytish
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Orqaga qaytish
          </Button>

          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/specialists">
              <Search className="w-5 h-5 mr-2" />
              Mutaxassislarni qidirish
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yordam kerakmi?
          </h3>
          <div className="space-y-3 text-sm">
            <Link
              to="/categories"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Xizmat kategoriyalarini ko'rish
            </Link>
            <Link
              to="/contact"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Qo'llab-quvvatlash bilan bog'lanish
            </Link>
            <Link
              to="/faq"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Tez-tez so'raladigan savollar
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Agar muammo davom etsa,
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-700 ml-1"
            >
              biz bilan bog'laning
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

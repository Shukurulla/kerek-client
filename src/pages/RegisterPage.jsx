import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/Auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span>Mutaxassislar</span>
          </Link>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2024 Mutaxassislar platformasi. Barcha huquqlar himoyalangan.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Maxfiylik siyosati
            </Link>
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Foydalanish shartlari
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

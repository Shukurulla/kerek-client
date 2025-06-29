"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import SpecialistsPage from "./pages/SpecialistsPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import BookingsPage from "./pages/BookingsPage";
import ChatPage from "./pages/ChatPage";
import PaymentsPage from "./pages/PaymentsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Loading from "./components/UI/Loading";
import { checkAuth } from "./store/authSlice";
import { useAuth } from "./hooks/useAuth";
import { useSocket } from "./hooks/useSocket";

const Route = ({ path, element, isProtected = false }) => {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState("/");

  if (currentRoute === path) {
    if (isProtected && !isAuthenticated) {
      return <LoginPage />;
    }
    return element;
  }
  return null;
};

const navigate = (path) => {
  window.location.href = path; // Redirect using window.location
};

const ProtectedRoute = ({
  children,
  requiredAuth = true,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (requiredAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requiredAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredAuth={false} redirectTo="/dashboard">
      {children}
    </ProtectedRoute>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const socket = useSocket();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {}, [isAuthenticated]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/specialists" element={<SpecialistsPage />} />
            <Route path="/specialists/:id" element={<SpecialistsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoriesPage />} />

            {/* Auth Routes (only for non-authenticated users) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes (only for authenticated users) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;

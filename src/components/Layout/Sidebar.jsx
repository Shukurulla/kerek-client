import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  User,
  Search,
  MessageCircle,
  Calendar,
  CreditCard,
  Star,
  Settings,
  LogOut,
  Grid3X3,
  Users,
  BarChart3,
} from "lucide-react";
import { logout } from "../../store/authSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    onClose?.();
  };

  const menuItems = [
    {
      path: "/",
      icon: Home,
      label: "Bosh sahifa",
      roles: ["client", "specialist"],
    },
    {
      path: "/profile",
      icon: User,
      label: "Profil",
      roles: ["client", "specialist"],
    },
    {
      path: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
      roles: ["specialist"],
    },
    {
      path: "/specialists",
      icon: Search,
      label: "Mutaxassislar",
      roles: ["client"],
    },
    {
      path: "/categories",
      icon: Grid3X3,
      label: "Kategoriyalar",
      roles: ["client", "specialist"],
    },
    {
      path: "/bookings",
      icon: Calendar,
      label: "Bookinglar",
      roles: ["client", "specialist"],
    },
    {
      path: "/chat",
      icon: MessageCircle,
      label: "Xabarlar",
      roles: ["client", "specialist"],
    },
    {
      path: "/reviews",
      icon: Star,
      label: "Baholashlar",
      roles: ["specialist"],
    },
    {
      path: "/payments",
      icon: CreditCard,
      label: "To'lovlar",
      roles: ["specialist"],
    },
    { path: "/admin", icon: Users, label: "Admin panel", roles: ["admin"] },
    {
      path: "/settings",
      icon: Settings,
      label: "Sozlamalar",
      roles: ["client", "specialist"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-gray-800">
              Mutaxassislar
            </span>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role === "specialist" ? "Mutaxassis" : "Mijoz"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  MessageCircle,
  Calendar,
  Plus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../UI/Button";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const notifications = [
    {
      id: 1,
      title: "Yangi loyiha so'rovi",
      message: "Abdulloh sizdan veb-sayt yaratish uchun so'rov yubordi",
      time: "5 daqiqa oldin",
      unread: true,
    },
    {
      id: 2,
      title: "To'lov tasdiqlandi",
      message: "Oylik obuna to'lovingiz muvaffaqiyatli amalga oshirildi",
      time: "1 soat oldin",
      unread: true,
    },
    {
      id: 3,
      title: "Yangi sharh",
      message: "Malika sizning ishingizga 5 yulduzli baho qo'ydi",
      time: "2 soat oldin",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center space-x-3 ml-2 md:ml-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Mutaxassislar
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Bosh sahifa
            </a>
            <a
              href="/specialists"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Mutaxassislar
            </a>
            <a
              href="/categories"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Kategoriyalar
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/bookings"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Loyihalar
                </a>
                <a
                  href="/chat"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Xabarlar
                </a>
              </>
            )}
            <a
              href="/help"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Yordam
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-2">
                  {user?.role === "specialist" && (
                    <Button size="sm" variant="ghost">
                      <Plus className="w-4 h-4 mr-2" />
                      Xizmat qo'shish
                    </Button>
                  )}
                  {user?.role === "client" && (
                    <Button size="sm" variant="ghost">
                      <Search className="w-4 h-4 mr-2" />
                      Mutaxassis topish
                    </Button>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">
                          Bildirishnomalar
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  notification.unread
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Barchasini ko'rish
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img
                      src={
                        user?.profileImage ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      }
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              user?.profileImage ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                            }
                            alt={user?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email || user?.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profil
                        </a>
                        <a
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          Dashboard
                        </a>
                        <a
                          href="/chat"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-3" />
                          Xabarlar
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Sozlamalar
                        </a>
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Chiqish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  Kirish
                </Button>
                <Button size="sm">Ro'yxatdan o'tish</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <a
              href="/"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Bosh sahifa
            </a>
            <a
              href="/specialists"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Mutaxassislar
            </a>
            <a
              href="/categories"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Kategoriyalar
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/bookings"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Loyihalar
                </a>
                <a
                  href="/chat"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Xabarlar
                </a>
                <a
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </a>
              </>
            )}
            <a
              href="/help"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Yordam
            </a>

            {!isAuthenticated && (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Button variant="ghost" fullWidth>
                  Kirish
                </Button>
                <Button fullWidth>Ro'yxatdan o'tish</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

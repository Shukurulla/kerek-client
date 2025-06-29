import React, { useState } from "react";
import {
  Plus,
  Search,
  MessageCircle,
  Star,
  Briefcase,
  Users,
  Settings,
  Bell,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
  Eye,
  Edit,
  Clock,
  Target,
  Heart,
  Share2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import Badge from "../UI/Badge";

const QuickActions = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState([
    "Web developer",
    "Grafik dizayner",
    "SMM mutaxassis",
  ]);

  // Specialist quick actions
  const specialistActions = [
    {
      id: "add-service",
      title: "Xizmat qo'shish",
      description: "Yangi xizmat e'lon qiling",
      icon: Plus,
      color: "blue",
      action: () => navigate("/profile/services/add"),
      badge: null,
    },
    {
      id: "update-portfolio",
      title: "Portfolio yangilash",
      description: "Ish namunalaringizni qo'shing",
      icon: Briefcase,
      color: "purple",
      action: () => navigate("/profile/portfolio"),
      badge: null,
    },
    {
      id: "messages",
      title: "Xabarlar",
      description: "Mijozlar bilan muloqot",
      icon: MessageCircle,
      color: "green",
      action: () => navigate("/chat"),
      badge: 3,
    },
    {
      id: "bookings",
      title: "Loyihalar",
      description: "Faol va yangi loyihalar",
      icon: Calendar,
      color: "orange",
      action: () => navigate("/bookings"),
      badge: 2,
    },
    {
      id: "earnings",
      title: "Daromad",
      description: "Moliyaviy hisobot",
      icon: DollarSign,
      color: "green",
      action: () => navigate("/earnings"),
      badge: null,
    },
    {
      id: "profile-settings",
      title: "Profil sozlamalari",
      description: "Ma'lumotlarni yangilang",
      icon: Settings,
      color: "gray",
      action: () => navigate("/profile/edit"),
      badge: null,
    },
  ];

  // Client quick actions
  const clientActions = [
    {
      id: "find-specialist",
      title: "Mutaxassis qidirish",
      description: "Kerakli xizmatni toping",
      icon: Search,
      color: "blue",
      action: () => navigate("/specialists"),
      badge: null,
    },
    {
      id: "my-projects",
      title: "Mening loyihalarim",
      description: "Faol va tugallangan ishlar",
      icon: Briefcase,
      color: "purple",
      action: () => navigate("/bookings"),
      badge: 1,
    },
    {
      id: "messages",
      title: "Xabarlar",
      description: "Mutaxassislar bilan aloqa",
      icon: MessageCircle,
      color: "green",
      action: () => navigate("/chat"),
      badge: 5,
    },
    {
      id: "favorites",
      title: "Saqlangan",
      description: "Yoqtirgan mutaxassislar",
      icon: Heart,
      color: "red",
      action: () => navigate("/favorites"),
      badge: null,
    },
    {
      id: "reviews",
      title: "Baholashlar",
      description: "Fikr-mulohazalar yozing",
      icon: Star,
      color: "yellow",
      action: () => navigate("/reviews"),
      badge: null,
    },
    {
      id: "profile",
      title: "Profil",
      description: "Shaxsiy ma'lumotlar",
      icon: Settings,
      color: "gray",
      action: () => navigate("/profile"),
      badge: null,
    },
  ];

  const quickStats =
    user.role === "specialist"
      ? [
          {
            label: "Faol loyihalar",
            value: user.stats?.activeProjects || 0,
            icon: Briefcase,
            color: "blue",
          },
          {
            label: "Tugallangan",
            value: user.stats?.completedProjects || 0,
            icon: Star,
            color: "green",
          },
          {
            label: "Reyting",
            value: user.rating?.average || 0,
            icon: Star,
            color: "yellow",
          },
          {
            label: "Ko'rinish",
            value: user.stats?.profileViews || 0,
            icon: Eye,
            color: "purple",
          },
        ]
      : [
          {
            label: "Faol loyihalar",
            value: 2,
            icon: Briefcase,
            color: "blue",
          },
          {
            label: "Tugallangan",
            value: 5,
            icon: Star,
            color: "green",
          },
          {
            label: "Xabarlar",
            value: 8,
            icon: MessageCircle,
            color: "purple",
          },
          {
            label: "Saqlanganlar",
            value: 12,
            icon: Heart,
            color: "red",
          },
        ];

  const currentActions =
    user.role === "specialist" ? specialistActions : clientActions;

  const ActionCard = ({ action }) => (
    <div
      onClick={action.action}
      className="relative bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-300 group"
    >
      {action.badge && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {action.badge}
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}
        >
          <action.icon className={`w-6 h-6 text-${action.color}-600`} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
            {action.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ stat }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
          <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
        </div>
      </div>
    </div>
  );

  const RecentSearchCard = ({ search }) => (
    <button
      onClick={() => navigate(`/specialists?q=${encodeURIComponent(search)}`)}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
    >
      <div className="flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-700">{search}</span>
      </div>
      <Clock className="w-4 h-4 text-gray-400" />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tezkor amallar</h2>
          <p className="text-gray-600">Tez-tez ishlatiladigan funksiyalar</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/profile/edit")}>
          <Edit className="w-4 h-4 mr-2" />
          Sozlash
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>

      {/* Recent Searches (Client only) */}
      {user.role === "client" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              So'nggi qidiruvlar
            </h3>
            <button
              onClick={() => setRecentSearches([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Tozalash
            </button>
          </div>

          {recentSearches.length > 0 ? (
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <RecentSearchCard key={index} search={search} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Hozircha qidiruvlar yo'q</p>
            </div>
          )}
        </div>
      )}

      {/* Productivity Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Samaradorlik maslahatlari
            </h3>
            {user.role === "specialist" ? (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Xabarlarni 2 soat ichida javob bering - mijozlar tez javobni
                    qadrlaydi
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Portfolio ni haftada bir marta yangilab turing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Profilingiz {user.analytics?.profileCompleteness || 0}%
                    to'ldirilgan - 100% ga yetkazish uchun ma'lumot qo'shing
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Mutaxassis tanlashda reyting va sharhlarni diqqat bilan
                    o'qing
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Loyiha talablarini batafsil va aniq yozing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ish tugagandan so'ng albatta baholash qoldiring</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Klaviatura yorliqlari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Qidiruv</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Xabarlar</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">M</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profil</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">P</kbd>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Loyihalar</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">B</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sozlamalar</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">S</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Yordam</span>
              <div className="flex space-x-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Ctrl
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">H</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() =>
            navigate(user.role === "specialist" ? "/bookings" : "/specialists")
          }
          size="lg"
          className="flex-1 sm:flex-none"
        >
          {user.role === "specialist" ? (
            <>
              <Briefcase className="w-5 h-5 mr-2" />
              Loyihalarni ko'rish
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Mutaxassis qidirish
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/chat")}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Xabarlar
          {user.role === "specialist" && (
            <Badge color="red" className="ml-2">
              3
            </Badge>
          )}
          {user.role === "client" && (
            <Badge color="red" className="ml-2">
              5
            </Badge>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/profile")}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <Settings className="w-5 h-5 mr-2" />
          Profil
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;

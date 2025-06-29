import React from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MessageCircle,
  Star,
  Clock,
  Award,
} from "lucide-react";
import Overview from "../components/Dashboard/Overview";
import Stats from "../components/Dashboard/Stats";
import QuickActions from "../components/Dashboard/QuickActions";
import Card from "../components/UI/Card";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Xayrli tong";
    if (hour < 18) return "Xayrli kun";
    return "Xayrli kech";
  };

  const quickStats = [
    {
      title: "Tugallangan loyihalar",
      value: user?.stats?.completedProjects || 0,
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Faol loyihalar",
      value: user?.stats?.activeProjects || 0,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Umumiy daromad",
      value: `${(user?.stats?.totalEarnings || 0).toLocaleString()} so'm`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Reyting",
      value: `${user?.rating?.average || 0}/5`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === "specialist"
                  ? "Bugungi faoliyatingiz va statistikalarni ko'ring"
                  : "Loyihalaringiz va mutaxassislaringizni boshqaring"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Obuna holati</div>
                <div
                  className={`font-medium ${
                    user?.subscription?.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {user?.subscription?.isActive ? "Faol" : "Nofaol"}
                </div>
              </div>

              {user?.role === "specialist" && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Profil ko'rinish</div>
                  <div className="font-medium text-gray-900">
                    {user?.stats?.profileViews || 0}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview */}
          <div className="lg:col-span-2">
            <Overview />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

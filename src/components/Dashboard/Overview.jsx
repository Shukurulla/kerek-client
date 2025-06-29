import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Calendar,
  MessageCircle,
  Briefcase,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Activity,
  Award,
  Target,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import { useApi } from "../../hooks/useApi";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const { request } = useApi();

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedProjects: 0,
    activeProjects: 0,
    totalEarnings: 0,
    averageRating: 0,
    profileViews: 0,
    responseRate: 0,
    completionRate: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Parallel requests
      const [statsResponse, activitiesResponse] = await Promise.all([
        request("/bookings/dashboard/stats"),
        request("/dashboard/activities"), // This would be a new endpoint
      ]);

      setStats(statsResponse.summary || {});
      setRecentActivities(activitiesResponse.activities || []);
      setUpcomingTasks(activitiesResponse.tasks || []);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    color = "blue",
    prefix = "",
    suffix = "",
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {value}
            {suffix}
          </p>
          {change !== undefined && (
            <div
              className={`flex items-center mt-1 text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case "booking_request":
          return <Briefcase className="w-4 h-4" />;
        case "booking_completed":
          return <Star className="w-4 h-4" />;
        case "message_received":
          return <MessageCircle className="w-4 h-4" />;
        case "payment_received":
          return <DollarSign className="w-4 h-4" />;
        case "profile_view":
          return <Eye className="w-4 h-4" />;
        default:
          return <Activity className="w-4 h-4" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case "booking_request":
          return "text-blue-600 bg-blue-100";
        case "booking_completed":
          return "text-green-600 bg-green-100";
        case "message_received":
          return "text-purple-600 bg-purple-100";
        case "payment_received":
          return "text-green-600 bg-green-100";
        case "profile_view":
          return "text-gray-600 bg-gray-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    const formatTime = (date) => {
      const now = new Date();
      const activityDate = new Date(date);
      const diffMs = now - activityDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 5) return "Hozir";
      if (diffMins < 60) return `${diffMins} daq. oldin`;
      if (diffHours < 24) return `${diffHours} soat oldin`;
      if (diffDays < 7) return `${diffDays} kun oldin`;
      return activityDate.toLocaleDateString("uz-UZ");
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">
            {formatTime(activity.createdAt)}
          </p>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div
          className={`w-3 h-3 rounded-full ${
            task.priority === "high"
              ? "bg-red-500"
              : task.priority === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        ></div>
        <div>
          <p className="text-sm font-medium text-gray-900">{task.title}</p>
          <p className="text-xs text-gray-500">
            {task.dueDate && new Date(task.dueDate).toLocaleDateString("uz-UZ")}
          </p>
        </div>
      </div>
      <Badge
        color={
          task.priority === "high"
            ? "red"
            : task.priority === "medium"
            ? "yellow"
            : "green"
        }
      >
        {task.priority}
      </Badge>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Xush kelibsiz, {user.name}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              {user.role === "specialist"
                ? "Bugun sizda qanday rejalar bor?"
                : "Kerakli xizmatni topishda yordam beramiz"}
            </p>
            {user.role === "specialist" && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  <span>
                    Profil to'liqlik: {user.analytics?.profileCompleteness || 0}
                    %
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span>Reyting: {user.rating?.average || 0}/5</span>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === "specialist" ? (
          <>
            <StatCard
              title="Jami loyihalar"
              value={stats.totalBookings || 0}
              icon={Briefcase}
              change={5}
              color="blue"
            />
            <StatCard
              title="Tugallangan"
              value={stats.completedProjects || 0}
              icon={Star}
              change={12}
              color="green"
            />
            <StatCard
              title="Jami daromad"
              value={(stats.totalEarnings || 0).toLocaleString()}
              icon={DollarSign}
              change={8}
              color="green"
              suffix=" so'm"
            />
            <StatCard
              title="Reyting"
              value={user.rating?.average || 0}
              icon={Star}
              change={2}
              color="yellow"
              suffix="/5"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Faol loyihalar"
              value={stats.activeProjects || 0}
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="Tugallangan"
              value={stats.completedProjects || 0}
              icon={Star}
              color="green"
            />
            <StatCard
              title="Xabarlar"
              value={12}
              icon={MessageCircle}
              color="purple"
            />
            <StatCard
              title="Saqlanganlar"
              value={8}
              icon={Users}
              color="gray"
            />
          </>
        )}
      </div>

      {/* Performance Metrics (Specialist only) */}
      {user.role === "specialist" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ko'rinish</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Profil ko'rildi:</span>
                <span className="font-medium">
                  {user.stats?.profileViews || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kontakt so'rovlari:</span>
                <span className="font-medium">
                  {user.stats?.contactRequests || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Samaradorlik
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tugallanish:</span>
                <span className="font-medium">
                  {user.stats?.completionRate || 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Javob vaqti:</span>
                <span className="font-medium">
                  {user.stats?.responseTime || 0} daq
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Moliya</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Oylik daromad:</span>
                <span className="font-medium">
                  {((stats.totalEarnings || 0) / 12).toLocaleString()} so'm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">O'rtacha loyiha:</span>
                <span className="font-medium">
                  {user.stats?.averageProjectValue?.toLocaleString() || 0} so'm
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                So'nggi faoliyat
              </h3>
              <Button variant="ghost" size="sm">
                Barchasini ko'rish
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Hozircha faoliyat yo'q</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Yaqin vazifalar
              </h3>
              <Button variant="ghost" size="sm">
                Barchasini ko'rish
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task, index) => (
                  <TaskItem key={index} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Yaqin vazifalar yo'q</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tezkor amallar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.role === "specialist" ? (
            <>
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="w-4 h-4 mr-2" />
                Yangi loyiha qo'shish
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Portfolio yangilash
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Xabarlarga javob
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Statistika ko'rish
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Mutaxassis qidirish
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Xabarlar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="w-4 h-4 mr-2" />
                Mening loyihalarim
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Saqlanganlar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tips & Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Maslahatlar
            </h3>
            {user.role === "specialist" ? (
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Portfolio ni muntazam yangilab turing</p>
                <p>• Mijozlarning xabarlariga tez javob bering</p>
                <p>
                  • Profilingizni to'liq to'ldiring (hozir{" "}
                  {user.analytics?.profileCompleteness || 0}%)
                </p>
                <p>• Sifatli xizmat ko'rsating va ijobiy baholash oling</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Mutaxassislarni tanlaganda reytingga e'tibor bering</p>
                <p>• Loyiha talablarini batafsil yozing</p>
                <p>• Ish tugagandan keyin baholash qoldiring</p>
                <p>• Profil rasmingizni qo'ying</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

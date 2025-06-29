import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  Eye,
  MessageCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useApi } from "../../hooks/useApi";

const Stats = () => {
  const { user } = useSelector((state) => state.auth);
  const { request } = useApi();

  const [stats, setStats] = useState({
    overview: {},
    monthlyTrend: [],
    categoryBreakdown: [],
    recentMetrics: {},
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const endpoints =
        user.role === "specialist"
          ? ["/bookings/dashboard/stats", "/users/stats/update"]
          : ["/bookings/dashboard/stats"];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          request(`${endpoint}?timeRange=${timeRange}`)
        )
      );

      const [bookingStats, userStats] = responses;

      setStats({
        overview: bookingStats.summary || {},
        monthlyTrend: bookingStats.monthlyTrend || [],
        categoryBreakdown: bookingStats.categoryStats || [],
        recentMetrics: userStats || {},
      });
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = "blue",
    trend = "up",
    subtitle,
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {change !== undefined && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{Math.abs(change)}% o'tgan oyga nisbatan</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const MetricChart = ({ data, title, type = "line" }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Ma'lumot yo'q
          </div>
        </div>
      );
    }

    const maxValue = Math.max(
      ...data.map((item) => item.count || item.value || 0)
    );

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

        {type === "line" && (
          <div className="h-64">
            <div className="flex items-end justify-between h-full space-x-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${
                        maxValue > 0
                          ? ((item.count || item.value || 0) / maxValue) * 200
                          : 0
                      }px`,
                      minHeight: "2px",
                    }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600 transform -rotate-45 origin-top-left">
                    {item._id || item.label}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.count || item.value || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === "bar" && (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm text-gray-600 truncate">
                  {item.categoryName || item.label || item._id}
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          maxValue > 0
                            ? ((item.count || item.value || 0) / maxValue) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-medium text-gray-900 text-right">
                  {item.count || item.value || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PerformanceMetrics = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ishlash ko'rsatkichlari
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Response Time */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray={`${
                  ((user.stats?.responseTime || 0) / 60) * 100
                }, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {Math.round((user.stats?.responseTime || 0) / 60)}h
              </span>
            </div>
          </div>
          <h4 className="font-medium text-gray-900">Javob vaqti</h4>
          <p className="text-sm text-gray-500">O'rtacha</p>
        </div>

        {/* Completion Rate */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${user.stats?.completionRate || 0}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {user.stats?.completionRate || 0}%
              </span>
            </div>
          </div>
          <h4 className="font-medium text-gray-900">Tugallanish</h4>
          <p className="text-sm text-gray-500">Foizi</p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {user.stats?.repeatClientRate || 0}%
            </p>
            <p className="text-sm text-gray-600">Qayta mijozlar</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {((user.stats?.averageProjectValue || 0) / 1000).toFixed(1)}k
            </p>
            <p className="text-sm text-gray-600">O'rtacha loyiha</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {user.rating?.count || 0}
            </p>
            <p className="text-sm text-gray-600">Baholashlar</p>
          </div>
        </div>
      </div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistika</h1>
          <p className="text-gray-600">
            Sizning faoliyatingiz haqida batafsil ma'lumot
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">So'nggi 7 kun</option>
            <option value="30d">So'nggi 30 kun</option>
            <option value="90d">So'nggi 3 oy</option>
            <option value="1y">So'nggi yil</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === "specialist" ? (
          <>
            <StatCard
              title="Jami loyihalar"
              value={stats.overview.totalBookings || 0}
              change={15}
              icon={Target}
              color="blue"
              subtitle="Barcha vaqt"
            />
            <StatCard
              title="Tugallangan"
              value={stats.overview.completedBookings || 0}
              change={12}
              icon={Star}
              color="green"
              subtitle={`${user.stats?.completionRate || 0}% muvaffaqiyat`}
            />
            <StatCard
              title="Jami daromad"
              value={`${((stats.overview.totalEarnings || 0) / 1000).toFixed(
                0
              )}k`}
              change={8}
              icon={DollarSign}
              color="green"
              subtitle="so'm"
            />
            <StatCard
              title="Profil ko'rildi"
              value={user.stats?.profileViews || 0}
              change={25}
              icon={Eye}
              color="purple"
              subtitle="Bu oy"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Faol loyihalar"
              value={stats.overview.activeBookings || 0}
              icon={Activity}
              color="blue"
            />
            <StatCard
              title="Tugallangan"
              value={stats.overview.completedBookings || 0}
              icon={Star}
              color="green"
            />
            <StatCard
              title="Xabarlar"
              value={stats.overview.totalMessages || 0}
              icon={MessageCircle}
              color="purple"
            />
            <StatCard
              title="Mutaxassislar"
              value={stats.overview.specialistsContacted || 0}
              icon={Users}
              color="gray"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart
          data={stats.monthlyTrend}
          title="Oylik trend"
          type="line"
        />

        {user.role === "specialist" && (
          <MetricChart
            data={stats.categoryBreakdown}
            title="Kategoriya bo'yicha"
            type="bar"
          />
        )}
      </div>

      {/* Performance Section (Specialist only) */}
      {user.role === "specialist" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceMetrics />

          {/* Rating Breakdown */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reyting taqsimoti
            </h3>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  user.rating?.breakdown?.[
                    rating === 5
                      ? "five"
                      : rating === 4
                      ? "four"
                      : rating === 3
                      ? "three"
                      : rating === 2
                      ? "two"
                      : "one"
                  ] || 0;

                const total = user.rating?.count || 1;
                const percentage = ((count / total) * 100).toFixed(1);

                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span className="mr-2">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-600 text-right">
                      {count} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-2xl font-bold text-yellow-500">
                {user.rating?.average || 0}/5
              </p>
              <p className="text-sm text-gray-600">
                {user.rating?.count || 0} baholashdan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tahlil va tavsiyalar
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {user.role === "specialist" ? (
                <>
                  <p>
                    • Sizning tugallanish foizingiz{" "}
                    {user.stats?.completionRate || 0}% -
                    {(user.stats?.completionRate || 0) > 85
                      ? " ajoyib natija!"
                      : " yaxshilash mumkin"}
                  </p>
                  <p>
                    • O'rtacha javob vaqtingiz{" "}
                    {Math.round((user.stats?.responseTime || 0) / 60)} soat -
                    {(user.stats?.responseTime || 0) < 120
                      ? " tez javob berasiz"
                      : " tezroq javob berishga harakat qiling"}
                  </p>
                  <p>
                    • Profil ko'rilish soni {user.stats?.profileViews || 0} -
                    {(user.stats?.profileViews || 0) > 100
                      ? " yaxshi ko'rinish!"
                      : " profilingizni yangilang"}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    • Faol loyihalaringiz soni:{" "}
                    {stats.overview.activeBookings || 0}
                  </p>
                  <p>
                    • Tugallangan loyihalar:{" "}
                    {stats.overview.completedBookings || 0}
                  </p>
                  <p>
                    • Yangi mutaxassislar bilan tanishish uchun qidiruv
                    bo'limidan foydalaning
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

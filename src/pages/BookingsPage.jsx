import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Filter, Calendar, Clock, User } from "lucide-react";
import BookingCard from "../components/Bookings/BookingCard";
import BookingForm from "../components/Bookings/BookingForm";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Badge from "../components/UI/Badge";

const BookingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock data - replace with real data from store
  const mockBookings = [
    {
      _id: "1",
      title: "Veb-sayt yaratish",
      description: "Korxona uchun zamonaviy veb-sayt kerak",
      status: "in_progress",
      client: { name: "Alisher Karimov", profileImage: null },
      specialist: { name: "Nodira Saidova", profileImage: null },
      scheduledDate: new Date("2024-01-15"),
      budget: { agreed: 2000000 },
      category: { names: { uz: "Veb-ishlab chiqish" } },
    },
    {
      _id: "2",
      title: "Logo dizayni",
      description: "Yangi brend uchun logo va korporativ identifikatsiya",
      status: "requested",
      client: { name: "Madina Tursunova", profileImage: null },
      specialist: { name: "Bekzod Rahimov", profileImage: null },
      scheduledDate: new Date("2024-01-20"),
      budget: { agreed: 500000 },
      category: { names: { uz: "Grafik dizayn" } },
    },
  ];

  const tabs = [
    { id: "all", label: "Barchasi", count: mockBookings.length },
    { id: "requested", label: "So'ralgan", count: 1 },
    { id: "active", label: "Faol", count: 1 },
    { id: "completed", label: "Tugallangan", count: 0 },
    { id: "cancelled", label: "Bekor qilingan", count: 0 },
  ];

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "active")
      return ["accepted", "in_progress"].includes(booking.status);
    return booking.status === activeTab;
  });

  const getStatusColor = (status) => {
    const statusColors = {
      requested: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      in_progress: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      requested: "So'ralgan",
      accepted: "Qabul qilingan",
      in_progress: "Jarayonda",
      completed: "Tugallangan",
      cancelled: "Bekor qilingan",
      rejected: "Rad etilgan",
    };
    return statusTexts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookinglar</h1>
              <p className="text-gray-600 mt-1">
                {user?.role === "specialist"
                  ? "Sizga yuborilgan loyiha so'rovlarini boshqaring"
                  : "O'z loyihalaringizni kuzatib boring"}
              </p>
            </div>

            {user?.role === "client" && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yangi loyiha
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" size="sm" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrlar
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Sana
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Mutaxassis
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.title}
                      </h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">{booking.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Kategoriya:</span>
                        <span className="ml-2 font-medium">
                          {booking.category?.names?.uz}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Sana:</span>
                        <span className="ml-2 font-medium">
                          {booking.scheduledDate.toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Byudjet:</span>
                        <span className="ml-2 font-medium">
                          {booking.budget?.agreed?.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user?.role === "specialist"
                            ? `Mijoz: ${booking.client?.name}`
                            : `Mutaxassis: ${booking.specialist?.name}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          2 kun oldin yaratilgan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      Ko'rish
                    </Button>
                    {booking.status === "requested" &&
                      user?.role === "specialist" && (
                        <>
                          <Button size="sm">Qabul qilish</Button>
                          <Button variant="outline" size="sm">
                            Rad etish
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bookinglar topilmadi
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "all"
                ? "Hali birorta booking yo'q"
                : `${getStatusText(activeTab)} holatida bookinglar yo'q`}
            </p>
            {user?.role === "client" && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Birinchi loyihangizni yarating
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Yangi loyiha yaratish"
        size="lg"
      >
        <BookingForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

export default BookingsPage;

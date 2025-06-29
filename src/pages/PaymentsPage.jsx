import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Download,
  Filter,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import Modal from "../components/UI/Modal";

const PaymentsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Mock data - replace with real data
  const mockPayments = [
    {
      _id: "1",
      amount: 2000,
      currency: "UZS",
      paymentMethod: "click",
      status: "success",
      description: "Oylik obuna to'lovi",
      createdAt: new Date("2024-01-15"),
      transactionId: "TX001",
    },
    {
      _id: "2",
      amount: 2000,
      currency: "UZS",
      paymentMethod: "payme",
      status: "success",
      description: "Oylik obuna to'lovi",
      createdAt: new Date("2023-12-15"),
      transactionId: "TX002",
    },
  ];

  const mockEarnings = [
    {
      _id: "1",
      amount: 500000,
      currency: "UZS",
      source: "booking",
      status: "completed",
      description: "Veb-sayt yaratish loyihasi",
      createdAt: new Date("2024-01-10"),
      client: "Alisher Karimov",
    },
    {
      _id: "2",
      amount: 300000,
      currency: "UZS",
      source: "booking",
      status: "pending",
      description: "Logo dizayni",
      createdAt: new Date("2024-01-08"),
      client: "Madina Tursunova",
    },
  ];

  const tabs = [
    { id: "overview", label: "Umumiy ko'rinish" },
    { id: "payments", label: "To'lovlar" },
    ...(user?.role === "specialist"
      ? [{ id: "earnings", label: "Daromadlar" }]
      : []),
    { id: "subscription", label: "Obuna" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalEarnings = mockEarnings
    .filter((e) => e.status === "completed")
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingEarnings = mockEarnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPayments = mockPayments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Moliya</h1>
              <p className="text-gray-600 mt-1">
                To'lovlar, daromadlar va obuna ma'lumotlari
              </p>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Eksport
              </Button>
              {user?.role === "specialist" && !user?.subscription?.isActive && (
                <Button onClick={() => setShowSubscriptionModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Obuna sotib olish
                </Button>
              )}
            </div>
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
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {user?.role === "specialist" && (
                <>
                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Jami daromad</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {totalEarnings.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-100">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Kutilayotgan</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {pendingEarnings.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Jami to'lovlar</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalPayments.toLocaleString()} so'm
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Obuna holati</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {user?.subscription?.isActive ? "Faol" : "Nofaol"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                So'nggi tranzaksiyalar
              </h3>
              <div className="space-y-4">
                {[
                  ...mockPayments,
                  ...(user?.role === "specialist" ? mockEarnings : []),
                ]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.createdAt.toLocaleDateString("uz-UZ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {transaction.amount.toLocaleString()}{" "}
                          {transaction.currency}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === "payments" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                To'lovlar tarixi
              </h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtr
              </Button>
            </div>

            <div className="space-y-4">
              {mockPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.transactionId} •{" "}
                        {payment.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.createdAt.toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Subscription Modal */}
        <Modal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          title="Obuna sotib olish"
          size="md"
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Obuna
              </h3>
              <p className="text-gray-600">
                Barcha imkoniyatlardan foydalaning
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  20,000 so'm
                </div>
                <div className="text-gray-600">oyiga</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cheksiz kategoriyalar</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Premium qo'llab-quvvatlash</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Kengaytirilgan statistika</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full">Click orqali to'lash</Button>
              <Button variant="outline" className="w-full">
                Payme orqali to'lash
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentsPage;

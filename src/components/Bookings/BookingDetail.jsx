import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  MessageCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import Card from "../UI/Card";
import Modal from "../UI/Modal";
import { formatDate, formatTime, formatPrice } from "../../utils/formatters";

const BookingDetail = ({
  booking,
  currentUserRole,
  onStatusChange,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  const {
    _id,
    title,
    description,
    status,
    client,
    specialist,
    category,
    scheduledDate,
    actualStartDate,
    actualEndDate,
    budget,
    location,
    priority,
    progress,
    timeEntries,
    tasks,
    files,
    communications,
    milestones,
    createdAt,
    updatedAt,
  } = booking;

  const tabs = [
    { id: "overview", label: "Umumiy ma'lumot" },
    { id: "tasks", label: "Vazifalar" },
    { id: "files", label: "Fayllar" },
    { id: "communication", label: "Aloqa" },
    { id: "timeline", label: "Vaqt jadvali" },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      requested: { label: "So'ralgan", color: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "Qabul qilingan", color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "Jarayonda", color: "bg-green-100 text-green-800" },
      completed: { label: "Tugallangan", color: "bg-gray-100 text-gray-800" },
      cancelled: { label: "Bekor qilingan", color: "bg-red-100 text-red-800" },
      rejected: { label: "Rad etilgan", color: "bg-red-100 text-red-800" },
    };
    return configs[status] || configs.requested;
  };

  const statusConfig = getStatusConfig(status);
  const otherParty = currentUserRole === "specialist" ? client : specialist;
  const canEdit = ["requested", "accepted"].includes(status);

  const calculateTotalHours = () => {
    return timeEntries?.reduce((total, entry) => total + entry.hours, 0) || 0;
  };

  const getCompletedTasks = () => {
    return tasks?.filter((task) => task.status === "completed").length || 0;
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(booking, newStatus);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(booking._id, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            </div>

            <p className="text-gray-600 mb-4">{description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={otherParty?.profileImage}
                  alt={otherParty?.name}
                  size="md"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {otherParty?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentUserRole === "specialist" ? "Mijoz" : "Mutaxassis"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Kategoriya</div>
                <div className="font-medium text-gray-900">
                  {category?.names?.uz}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Yaratilgan</div>
                <div className="font-medium text-gray-900">
                  {formatDate(createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {canEdit && (
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
            )}

            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Xabar yuborish
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {status === "in_progress" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Jarayon</span>
              <span className="text-sm font-medium text-gray-900">
                {progress || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {calculateTotalHours()}
            </div>
            <div className="text-sm text-gray-500">Jami soatlar</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {getCompletedTasks()}/{tasks?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Vazifalar</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {files?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Fayllar</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(budget?.agreed || 0)}
            </div>
            <div className="text-sm text-gray-500">Byudjet</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
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

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Loyiha tafsilotlari
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Rejalashtirilgan sana
                        </div>
                        <div className="font-medium">
                          {formatDate(scheduledDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Vaqt</div>
                        <div className="font-medium">
                          {formatTime(scheduledDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Joylashuv</div>
                        <div className="font-medium">
                          {location?.address || "Masofaviy ish"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Moliyaviy ma'lumotlar
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kelishilgan narx</span>
                      <span className="font-medium">
                        {formatPrice(budget?.agreed || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minimal narx</span>
                      <span className="font-medium">
                        {formatPrice(budget?.min || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Maksimal narx</span>
                      <span className="font-medium">
                        {formatPrice(budget?.max || 0)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Milestones */}
              {milestones && milestones.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Bosqichlar
                  </h3>
                  <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              milestone.status === "completed"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {milestone.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {milestone.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(milestone.payment?.amount || 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {milestone.dueDate && formatDate(milestone.dueDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Vazifalar</h3>
                {currentUserRole === "specialist" && (
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Vazifa qo'shish
                  </Button>
                )}
              </div>

              {tasks && tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                              task.status === "completed"
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {task.status === "completed" && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                            {task.dueDate && (
                              <div className="text-xs text-gray-500 mt-1">
                                Muddat: {formatDate(task.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Hali vazifalar qo'shilmagan</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Fayllar</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Fayl yuklash
                </Button>
              </div>

              {files && files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="font-medium text-sm truncate">
                            {file.originalName}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {file.uploadedBy?.name} • {formatDate(file.uploadedAt)}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Hali fayllar yuklanmagan</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "communication" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Aloqa va izohlar</h3>

              {/* Comment Form */}
              <Card className="p-4">
                <div className="flex space-x-3">
                  <Avatar
                    src={
                      currentUserRole === "specialist"
                        ? specialist?.profileImage
                        : client?.profileImage
                    }
                    alt="Current user"
                    size="sm"
                  />
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      placeholder="Izoh yozing..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Izoh qo'shish
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Communications List */}
              {communications && communications.length > 0 ? (
                <div className="space-y-4">
                  {communications.map((comm, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex space-x-3">
                        <Avatar
                          src={comm.from?.profileImage}
                          alt={comm.from?.name}
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comm.from?.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comm.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comm.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Hali izohlar yo'q</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Vaqt jadvali</h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Loyiha yaratildi
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(createdAt)}
                    </div>
                  </div>
                </div>

                {actualStartDate && (
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Loyiha boshlandi
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(actualStartDate)}
                      </div>
                    </div>
                  </div>
                )}

                {actualEndDate && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Loyiha tugallandi
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(actualEndDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {status !== "completed" && status !== "cancelled" && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Harakatlar</h3>
          <div className="flex space-x-3">
            {status === "requested" && currentUserRole === "specialist" && (
              <>
                <Button onClick={() => handleStatusChange("accepted")}>
                  Qabul qilish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("rejected")}
                >
                  Rad etish
                </Button>
              </>
            )}

            {status === "accepted" && currentUserRole === "specialist" && (
              <Button onClick={() => handleStatusChange("in_progress")}>
                Loyihani boshlash
              </Button>
            )}

            {status === "in_progress" && (
              <Button onClick={() => handleStatusChange("completed")}>
                Loyihani tugatish
              </Button>
            )}

            {["requested", "accepted"].includes(status) && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("cancelled")}
              >
                Bekor qilish
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Loyihani tahrirlash"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Loyiha ma'lumotlarini tahrirlash funksiyasi tez orada qo'shiladi.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Yopish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetail;

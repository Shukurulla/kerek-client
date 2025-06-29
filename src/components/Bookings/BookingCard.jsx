import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import Card from "../UI/Card";

const BookingCard = ({
  booking,
  onStatusChange,
  onViewDetails,
  currentUserRole,
}) => {
  const {
    _id,
    title,
    description,
    status,
    client,
    specialist,
    category,
    scheduledDate,
    budget,
    location,
    priority,
    progress,
    createdAt,
  } = booking;

  const getStatusConfig = (status) => {
    const configs = {
      requested: {
        label: "So'ralgan",
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
        bgColor: "bg-yellow-50",
      },
      accepted: {
        label: "Qabul qilingan",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        bgColor: "bg-blue-50",
      },
      in_progress: {
        label: "Jarayonda",
        color: "bg-green-100 text-green-800",
        icon: Clock,
        bgColor: "bg-green-50",
      },
      completed: {
        label: "Tugallangan",
        color: "bg-gray-100 text-gray-800",
        icon: CheckCircle,
        bgColor: "bg-gray-50",
      },
      cancelled: {
        label: "Bekor qilingan",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        bgColor: "bg-red-50",
      },
      rejected: {
        label: "Rad etilgan",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        bgColor: "bg-red-50",
      },
    };
    return configs[status] || configs.requested;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: "Past",
      medium: "O'rta",
      high: "Yuqori",
      urgent: "Shoshilinch",
    };
    return labels[priority] || labels.medium;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const otherParty = currentUserRole === "specialist" ? client : specialist;

  const getAvailableActions = () => {
    const actions = [];

    if (status === "requested" && currentUserRole === "specialist") {
      actions.push(
        { label: "Qabul qilish", action: "accept", variant: "default" },
        { label: "Rad etish", action: "reject", variant: "outline" }
      );
    }

    if (status === "accepted" && currentUserRole === "specialist") {
      actions.push({ label: "Boshlash", action: "start", variant: "default" });
    }

    if (status === "in_progress") {
      actions.push({
        label: "Tugallash",
        action: "complete",
        variant: "default",
      });
    }

    if (["requested", "accepted"].includes(status)) {
      actions.push({
        label: "Bekor qilish",
        action: "cancel",
        variant: "outline",
      });
    }

    return actions;
  };

  const handleAction = (action) => {
    if (onStatusChange) {
      onStatusChange(booking, action);
    }
  };

  const isOverdue =
    new Date(scheduledDate) < new Date() &&
    !["completed", "cancelled"].includes(status);

  return (
    <Card
      className={`p-6 hover:shadow-md transition-shadow ${statusConfig.bgColor}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              <Link to={`/bookings/${_id}`}>{title}</Link>
            </h3>

            <Badge className={statusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>

            {priority !== "medium" && (
              <Badge variant="outline" className={getPriorityColor(priority)}>
                {getPriorityLabel(priority)}
              </Badge>
            )}

            {isOverdue && (
              <Badge variant="destructive" size="sm">
                Kechikish
              </Badge>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Progress Bar */}
          {status === "in_progress" && progress !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Jarayon</span>
                <span className="text-gray-900 font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500">
              {currentUserRole === "specialist" ? "Mijoz" : "Mutaxassis"}
            </div>
            <div className="font-medium text-gray-900">{otherParty?.name}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500">Sana</div>
            <div className="font-medium text-gray-900">
              {formatDate(scheduledDate)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500">Byudjet</div>
            <div className="font-medium text-gray-900">
              {budget?.agreed
                ? `${budget.agreed.toLocaleString()} so'm`
                : "Kelishilmagan"}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-500">Joylashuv</div>
            <div className="font-medium text-gray-900">
              {location?.address || "Masofaviy"}
            </div>
          </div>
        </div>
      </div>

      {/* Category & Time */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>Kategoriya: {category?.names?.uz}</span>
          <span>•</span>
          <span>Yaratilgan: {formatDate(createdAt)}</span>
        </div>
        <div>Vaqt: {formatTime(scheduledDate)}</div>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-lg">
        <Avatar
          src={otherParty?.profileImage}
          alt={otherParty?.name}
          size="sm"
        />
        <div className="flex-1">
          <div className="font-medium text-gray-900">{otherParty?.name}</div>
          <div className="text-sm text-gray-500">
            {otherParty?.city} • {otherParty?.rating?.average || 0}/5 ⭐
          </div>
        </div>
        <Button variant="outline" size="sm">
          Profil
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(booking)}
        >
          Batafsil ko'rish
        </Button>

        <div className="flex space-x-2">
          {getAvailableActions().map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              onClick={() => handleAction(action.action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;

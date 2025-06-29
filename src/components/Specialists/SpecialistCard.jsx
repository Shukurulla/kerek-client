import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Verified,
  MessageCircle,
  Phone,
  Eye,
  Award,
  DollarSign,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import Badge from "../UI/Badge";
import Rating from "../UI/Rating";
import Button from "../UI/Button";
import { formatPrice, timeAgo } from "../../utils/helpers";

const SpecialistCard = ({ specialist, variant = "default", onContact }) => {
  const {
    _id,
    name,
    profileImage,
    city,
    headline,
    description,
    rating,
    categories,
    isOnline,
    lastSeen,
    stats,
    isVerified,
  } = specialist;

  const primaryCategory = categories?.[0];
  const minPrice = categories?.reduce(
    (min, cat) =>
      cat.pricing?.hourlyRate && (!min || cat.pricing.hourlyRate < min)
        ? cat.pricing.hourlyRate
        : min,
    null
  );

  const handleContact = () => {
    if (onContact) {
      onContact(specialist);
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar
              src={profileImage}
              alt={name}
              size="sm"
              className="ring-2 ring-white"
            />
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {name}
              </h3>
              {isVerified && <Verified className="w-4 h-4 text-blue-500" />}
            </div>

            <p className="text-xs text-gray-500 truncate">
              {headline || primaryCategory?.category?.names?.uz}
            </p>

            <div className="flex items-center space-x-3 mt-1">
              <Rating value={rating?.average} size="sm" showValue />
              <span className="text-xs text-gray-500">
                {stats?.completedProjects || 0} loyiha
              </span>
            </div>
          </div>

          <Button size="sm" onClick={handleContact}>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex space-x-4">
          <div className="relative flex-shrink-0">
            <Avatar
              src={profileImage}
              alt={name}
              size="lg"
              className="ring-2 ring-white"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Link
                    to={`/specialists/${_id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {name}
                  </Link>
                  {isVerified && <Verified className="w-5 h-5 text-blue-500" />}
                  <Badge variant="outline" size="sm">
                    {primaryCategory?.category?.names?.uz}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-2 line-clamp-1">{headline}</p>

                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{city}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {isOnline ? "Online" : `${timeAgo(lastSeen)} faol edi`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{stats?.profileViews || 0} ko'rishlar</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-2">
                  <Rating value={rating?.average} showValue />
                  <p className="text-xs text-gray-500 mt-1">
                    {rating?.count || 0} baholash
                  </p>
                </div>

                {minPrice && (
                  <div className="mb-3">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(minPrice)}
                    </p>
                    <p className="text-xs text-gray-500">dan boshlab</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link to={`/specialists/${_id}`}>Profilni ko'rish</Link>
                  </Button>

                  <Button size="sm" className="w-full" onClick={handleContact}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Bog'lanish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar
              src={profileImage}
              alt={name}
              size="lg"
              className="ring-4 ring-white shadow-lg"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link
                to={`/specialists/${_id}`}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors group-hover:text-blue-600"
              >
                {name}
              </Link>
              {isVerified && (
                <div className="relative group/tooltip">
                  <Verified className="w-5 h-5 text-blue-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                    Tasdiqlangan mutaxassis
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-600 font-medium mb-2">
              {headline || "Professional mutaxassis"}
            </p>

            <div className="flex items-center space-x-2 mb-3">
              <Rating value={rating?.average} showValue />
              <span className="text-sm text-gray-500">
                ({rating?.count || 0} baholash)
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{city}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{stats?.completedProjects || 0} loyiha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills/Categories */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {categories?.slice(0, 3).map((cat, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {cat.category?.names?.uz}
            </Badge>
          ))}
          {categories?.length > 3 && (
            <Badge variant="outline" size="sm">
              +{categories.length - 3} ko'proq
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      )}

      {/* Price */}
      {minPrice && (
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(minPrice)}
            </span>
            <span className="text-sm text-gray-500">dan boshlab</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {isOnline ? (
                <span className="text-green-600 font-medium">Online</span>
              ) : (
                `${timeAgo(lastSeen)} faol edi`
              )}
            </span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/specialists/${_id}`}>Profil</Link>
            </Button>

            <Button size="sm" onClick={handleContact}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Yozish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;

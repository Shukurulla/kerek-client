import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Edit3,
  Camera,
  Settings,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
} from "lucide-react";
import ProfileView from "../components/Profile/ProfileView";
import ProfileEdit from "../components/Profile/ProfileEdit";
import Portfolio from "../components/Profile/Portfolio";
import Button from "../components/UI/Button";
import Avatar from "../components/UI/Avatar";
import Badge from "../components/UI/Badge";
import Rating from "../components/UI/Rating";
import Card from "../components/UI/Card";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("view"); // 'view', 'edit', 'portfolio'

  const tabs = [
    { id: "view", label: "Ko'rish", icon: User },
    { id: "edit", label: "Tahrirlash", icon: Edit3 },
    ...(user?.role === "specialist"
      ? [{ id: "portfolio", label: "Portfolio", icon: Award }]
      : []),
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profil yuklanmoqda...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  src={user.profileImage}
                  alt={user.name}
                  size="xl"
                  className="ring-4 ring-white shadow-lg"
                />
                {activeTab === "edit" && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name} {user.lastName}
                  </h1>
                  {user.isVerified && (
                    <Badge variant="success" size="sm">
                      <Award className="w-3 h-3 mr-1" />
                      Tasdiqlangan
                    </Badge>
                  )}
                  <Badge variant="outline" size="sm">
                    {user.role === "specialist" ? "Mutaxassis" : "Mijoz"}
                  </Badge>
                </div>

                {user.headline && (
                  <p className="text-lg text-gray-600 mb-2">{user.headline}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("uz-UZ")} dan
                      beri
                    </span>
                  </div>
                </div>

                {/* Specialist Stats */}
                {user.role === "specialist" && (
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <Rating value={user.rating?.average || 0} size="sm" />
                      <span className="text-sm text-gray-600">
                        ({user.rating?.count || 0} baholash)
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {user.stats?.completedProjects || 0}
                      </span>{" "}
                      tugallangan loyiha
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {user.stats?.profileViews || 0}
                      </span>{" "}
                      profil ko'rishlar
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Sozlamalar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "view" && <ProfileView user={user} />}
        {activeTab === "edit" && <ProfileEdit user={user} />}
        {activeTab === "portfolio" && user.role === "specialist" && (
          <Portfolio user={user} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

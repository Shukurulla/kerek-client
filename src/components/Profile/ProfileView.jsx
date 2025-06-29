import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  MessageCircle,
  Heart,
  Share2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import Avatar from "../UI/Avatar";
import ReviewList from "../Reviews/ReviewList";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

const ProfileView = ({
  user: profileUser,
  onEdit,
  onMessage,
  isOwnProfile = false,
}) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { request } = useApi();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [following, setFollowing] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  const tabs = [
    { id: "overview", label: "Umumiy", count: null },
    { id: "portfolio", label: "Portfolio", count: getTotalPortfolioCount() },
    {
      id: "reviews",
      label: "Baholashlar",
      count: profileUser?.rating?.count || 0,
    },
    {
      id: "experience",
      label: "Tajriba",
      count: profileUser?.experience?.length || 0,
    },
    {
      id: "education",
      label: "Ta'lim",
      count: profileUser?.education?.length || 0,
    },
  ];

  function getTotalPortfolioCount() {
    return (
      profileUser?.categories?.reduce(
        (total, cat) => total + (cat.portfolio?.length || 0),
        0
      ) || 0
    );
  }

  const handleContact = async () => {
    try {
      await request(`/users/${profileUser._id}/contact`, { method: "POST" });
      showToast("Kontakt so'rovi yuborildi", "success");
    } catch (error) {
      showToast("Xato yuz berdi", "error");
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "";

    const now = new Date();
    const seen = new Date(lastSeen);
    const diffMs = now - seen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return "Hozir online";
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;

    return seen.toLocaleDateString("uz-UZ");
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      month: "long",
      year: "numeric",
    });
  };

  const ProfileHeader = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {profileUser.coverImage && (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {!isOwnProfile && (
            <>
              <Button size="sm" variant="outline" className="bg-white">
                <Heart className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </>
          )}

          {isOwnProfile && (
            <Button
              size="sm"
              onClick={onEdit}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              Tahrirlash
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          {/* Avatar */}
          <div className="relative -mt-16 md:-mt-20 mb-4 md:mb-0">
            <Avatar
              src={profileUser.profileImage}
              name={profileUser.fullName || profileUser.name}
              size="2xl"
              className="border-4 border-white shadow-lg"
            />

            {/* Online Status */}
            {profileUser.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {profileUser.fullName || profileUser.name}
                </h1>

                {profileUser.headline && (
                  <p className="text-lg text-gray-600 mb-2">
                    {profileUser.headline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profileUser.city}
                  </span>

                  {profileUser.email && !isOwnProfile && (
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {profileUser.email}
                    </span>
                  )}

                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatJoinDate(profileUser.createdAt)} dan beri
                  </span>

                  {!profileUser.isOnline && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatLastSeen(profileUser.lastSeen)}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  {profileUser.rating && profileUser.rating.count > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">
                        {profileUser.rating.average}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({profileUser.rating.count})
                      </span>
                    </div>
                  )}

                  {profileUser.stats && (
                    <>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span>
                          {profileUser.stats.completedProjects} tugallangan
                        </span>
                      </div>

                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                        <span>
                          {profileUser.stats.completionRate}% muvaffaqiyat
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{profileUser.stats.profileViews} ko'rildi</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={onMessage}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Xabar
                  </Button>

                  <Button variant="outline" onClick={handleContact}>
                    <Phone className="w-4 h-4 mr-1" />
                    Bog'lanish
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Description */}
      {profileUser.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Haqida</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {profileUser.description}
          </p>
        </div>
      )}

      {/* Categories & Skills */}
      {profileUser.role === "specialist" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mutaxassislik
          </h3>

          {profileUser.categories && profileUser.categories.length > 0 && (
            <div className="space-y-4">
              {profileUser.categories.map((category, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {category.category?.names?.uz}
                    </h4>
                    <Badge color="blue">
                      {category.experience} yil tajriba
                    </Badge>
                  </div>

                  {category.pricing && (
                    <div className="text-sm text-gray-600 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      {category.pricing.hourlyRate} {category.pricing.currency}
                      /soat
                    </div>
                  )}

                  <Badge color="green" className="text-xs">
                    {category.skillLevel}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {profileUser.skills && profileUser.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ko'nikmalar
          </h3>
          <div className="flex flex-wrap gap-2">
            {(showAllSkills
              ? profileUser.skills
              : profileUser.skills.slice(0, 10)
            ).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>

          {profileUser.skills.length > 10 && (
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              {showAllSkills
                ? "Kamroq ko'rish"
                : `+${profileUser.skills.length - 10} ta ko'proq`}
            </button>
          )}
        </div>
      )}

      {/* Services */}
      {profileUser.services && profileUser.services.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xizmatlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(showAllServices
              ? profileUser.services
              : profileUser.services.slice(0, 4)
            )
              .filter((service) => service.isActive)
              .map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {service.title}
                  </h4>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">
                      {service.pricing.amount} {service.pricing.currency}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {service.deliveryTime.value} {service.deliveryTime.unit}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {profileUser.services.length > 4 && (
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="text-blue-600 text-sm hover:underline mt-4"
            >
              {showAllServices
                ? "Kamroq ko'rish"
                : `+${profileUser.services.length - 4} ta ko'proq`}
            </button>
          )}
        </div>
      )}

      {/* Languages */}
      {profileUser.languages && profileUser.languages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tillar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileUser.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900">{lang.language}</span>
                <Badge color="blue" className="text-xs">
                  {lang.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {profileUser.social &&
        Object.values(profileUser.social).some((link) => link) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ijtimoiy tarmoqlar
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(profileUser.social).map(([platform, url]) => {
                if (!url) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {platform}
                  </a>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );

  const PortfolioTab = () => (
    <div className="space-y-6">
      {profileUser.categories?.map((category, categoryIndex) => {
        if (!category.portfolio || category.portfolio.length === 0) return null;

        return (
          <div
            key={categoryIndex}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {category.category?.names?.uz} Portfolio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.portfolio.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {item.client && <span>{item.client}</span>}
                      {item.projectDate && (
                        <span>{new Date(item.projectDate).getFullYear()}</span>
                      )}
                    </div>

                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.technologies
                          .slice(0, 3)
                          .map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        {item.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                      >
                        Ko'rish →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {getTotalPortfolioCount() === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Portfolio yo'q
          </h3>
          <p className="text-gray-500">
            Hozircha portfolio ishlar qo'shilmagan
          </p>
        </div>
      )}
    </div>
  );

  const ReviewsTab = () => (
    <ReviewList
      specialistId={profileUser._id}
      showSpecialist={false}
      showClient={true}
    />
  );

  const ExperienceTab = () => (
    <div className="space-y-4">
      {profileUser.experience && profileUser.experience.length > 0 ? (
        profileUser.experience.map((exp, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {exp.position}
                </h3>
                <p className="text-blue-600 font-medium">{exp.company}</p>
              </div>
              {exp.isCurrent && <Badge color="green">Hozir</Badge>}
            </div>

            <div className="text-gray-600 text-sm mb-3">
              {new Date(exp.startDate).toLocaleDateString("uz-UZ")} -{" "}
              {exp.endDate
                ? new Date(exp.endDate).toLocaleDateString("uz-UZ")
                : "Hozir"}
            </div>

            {exp.description && (
              <p className="text-gray-700 mb-3">{exp.description}</p>
            )}

            {exp.skills && exp.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {exp.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tajriba ma'lumotlari yo'q
          </h3>
          <p className="text-gray-500">
            Hozircha mehnat tajribasi qo'shilmagan
          </p>
        </div>
      )}
    </div>
  );

  const EducationTab = () => (
    <div className="space-y-4">
      {profileUser.education && profileUser.education.length > 0 ? (
        profileUser.education.map((edu, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {edu.degree}
                </h3>
                <p className="text-blue-600 font-medium">{edu.institution}</p>
                <p className="text-gray-600">{edu.field}</p>
              </div>
              {!edu.isCompleted && <Badge color="yellow">Davom etmoqda</Badge>}
            </div>

            <div className="text-gray-600 text-sm">
              {new Date(edu.startDate).getFullYear()} -{" "}
              {edu.endDate ? new Date(edu.endDate).getFullYear() : "Hozir"}
              {edu.gpa && <span className="ml-4">GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ta'lim ma'lumotlari yo'q
          </h3>
          <p className="text-gray-500">
            Hozircha ta'lim ma'lumotlari qo'shilmagan
          </p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "portfolio":
        return <PortfolioTab />;
      case "reviews":
        return <ReviewsTab />;
      case "experience":
        return <ExperienceTab />;
      case "education":
        return <EducationTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfileView;

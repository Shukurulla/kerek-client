import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  Award,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  Heart,
  Share2,
} from "lucide-react";
import Avatar from "../UI/Avatar";
import Badge from "../UI/Badge";
import Rating from "../UI/Rating";
import Button from "../UI/Button";
import Card from "../UI/Card";
import Modal from "../UI/Modal";

const SpecialistDetail = ({ specialist, onContact, onBooking }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    _id,
    name,
    lastName,
    profileImage,
    coverImage,
    headline,
    description,
    city,
    rating,
    categories,
    portfolio,
    experience,
    education,
    certificates,
    skills,
    languages,
    isOnline,
    lastSeen,
    stats,
    isVerified,
    workSchedule,
    services,
  } = specialist;

  const tabs = [
    { id: "overview", label: "Umumiy ma'lumot" },
    { id: "portfolio", label: "Portfolio" },
    { id: "reviews", label: "Baholashlar" },
    { id: "experience", label: "Tajriba" },
  ];

  const handleContact = () => {
    if (onContact) {
      onContact(specialist);
    }
    setShowContactModal(true);
  };

  const handleBooking = () => {
    if (onBooking) {
      onBooking(specialist);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name} - Mutaxassis`,
        text: headline,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover & Profile Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 md:mb-0">
              <Avatar
                src={profileImage}
                alt={name}
                size="xl"
                className="ring-4 ring-white shadow-lg"
              />
              {isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {name} {lastName}
                </h1>
                {isVerified && (
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                )}
              </div>

              <p className="text-lg text-gray-600 mb-3">{headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{city}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isOnline ? "Online" : `${lastSeen} oldin faol edi`}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats?.completedProjects || 0} loyiha</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <Rating value={rating?.average} size="lg" showValue />
                <span className="text-gray-600">
                  ({rating?.count || 0} baholash)
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories?.slice(0, 3).map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat.category?.names?.uz}
                  </Badge>
                ))}
                {categories?.length > 3 && (
                  <Badge variant="outline">
                    +{categories.length - 3} ko'proq
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 mt-4 md:mt-0">
              <Button onClick={handleContact} className="w-full md:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                Xabar yuborish
              </Button>
              <Button
                variant="outline"
                onClick={handleBooking}
                className="w-full md:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Loyiha berish
              </Button>
            </div>
          </div>
        </div>
      </div>

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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Haqida
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {description || "Tavsif mavjud emas."}
                </p>
              </div>

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Ko'nikmalar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Tillar
                  </h3>
                  <div className="space-y-2">
                    {languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{lang.language}</span>
                        <Badge variant="secondary">{lang.level}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {services && services.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Xizmatlar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-blue-600">
                            {service.pricing?.amount?.toLocaleString()} so'm
                          </span>
                          <Badge variant="outline" size="sm">
                            {service.deliveryTime?.value}{" "}
                            {service.deliveryTime?.unit}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Portfolio
              </h3>
              {portfolio && portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      {item.images && item.images[0] && (
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
                        <p className="text-sm text-gray-600 mb-3">
                          {item.description}
                        </p>
                        {item.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ko'rish
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Portfolio mavjud emas
                </p>
              )}
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-6">
              {/* Work Experience */}
              {experience && experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Mehnat tajribasi
                  </h3>
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {exp.position}
                            </h4>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <Badge variant="outline">
                            {exp.startDate} - {exp.endDate || "Hozir"}
                          </Badge>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-sm">
                            {exp.description}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ta'lim
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {edu.degree} - {edu.field}
                            </h4>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <Badge variant="outline">
                            {edu.startDate} - {edu.endDate || "Davom etmoqda"}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {certificates && certificates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sertifikatlar
                  </h3>
                  <div className="space-y-4">
                    {certificates.map((cert, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {cert.name}
                              </h4>
                              {cert.isVerified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {cert.issuer}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {cert.issueDate}
                            </p>
                          </div>
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Bog'lanish"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <Avatar
              src={profileImage}
              alt={name}
              size="lg"
              className="mx-auto mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {name} {lastName}
            </h3>
            <p className="text-gray-600">{headline}</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full" onClick={handleContact}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat orqali yozish
            </Button>

            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Telefon qilish
            </Button>

            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Email yuborish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpecialistDetail;

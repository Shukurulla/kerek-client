import React, { useState } from "react";
import {
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import Button from "../UI/Button";
import { useSelector } from "react-redux";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const { request } = useApi();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    middleName: user.middleName || "",
    email: user.email || "",
    birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
    gender: user.gender || "",
    city: user.city || "",
    district: user.district || "",
    address: user.address || "",
    headline: user.headline || "",
    description: user.description || "",
    skills: user.skills || [],
    languages: user.languages || [],
    social: user.social || {},
    preferences: user.preferences || {},
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({
    language: "",
    level: "intermediate",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cities = [
    "Toshkent",
    "Samarqand",
    "Buxoro",
    "Andijon",
    "Farg'ona",
    "Namangan",
    "Qashqadaryo",
    "Surxondaryo",
    "Jizzax",
    "Sirdaryo",
    "Navoiy",
    "Xorazm",
    "Qoraqalpog'iston",
  ];

  const languages = [
    { value: "uzbek", label: "O'zbekcha" },
    { value: "russian", label: "Ruscha" },
    { value: "english", label: "Inglizcha" },
    { value: "karakalpak", label: "Qoraqalpoqcha" },
    { value: "tajik", label: "Tojikcha" },
    { value: "kazakh", label: "Qozoqcha" },
    { value: "turkmen", label: "Turkmancha" },
  ];

  const languageLevels = [
    { value: "beginner", label: "Boshlang'ich" },
    { value: "intermediate", label: "O'rta" },
    { value: "advanced", label: "Yuqori" },
    { value: "native", label: "Ona tili" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.language &&
      !formData.languages.find((l) => l.language === newLanguage.language)
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage],
      }));
      setNewLanguage({ language: "", level: "intermediate" });
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Fayl hajmi 5MB dan oshmasligi kerak", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Faqat rasm fayllari qo'llab-quvvatlanadi", "error");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append(type, file);

      await request(`/users/profile/${type}`, {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Rasm yuklandi", "success");
    } catch (error) {
      showToast("Rasm yuklashda xato", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await request("/users/profile", {
        method: "PUT",
        data: formData,
      });

      showToast("Profil yangilandi", "success");
      onSave(response.user);
    } catch (error) {
      showToast("Profilni yangilashda xato", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Profilni tahrirlash
        </h2>
        <p className="text-gray-600">Ma'lumotlaringizni yangilang</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Profile Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Profil rasmlari
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil rasmi
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="Profil rasmi"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG (maks. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muqova rasmi
              </label>
              <div className="space-y-2">
                {user.coverImage && (
                  <img
                    src={user.coverImage}
                    alt="Muqova rasmi"
                    className="w-full h-24 rounded-lg object-cover border border-gray-300"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "cover")}
                    className="hidden"
                    id="cover-image"
                  />
                  <label
                    htmlFor="cover-image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Yuklanmoqda..." : "Muqova yuklash"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    1200x400 o'lchamda (maks. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Shaxsiy ma'lumotlar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ism *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Familiya
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otasining ismi
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) =>
                  handleInputChange("middleName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tug'ilgan sana
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jins
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tanlang</option>
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
              <option value="other">Boshqa</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Joylashuv</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shahar *
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Shaharni tanlang</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tuman
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tumaningizni kiriting"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To'liq manzil
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ko'cha, uy raqami va boshqa ma'lumotlar"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Professional ma'lumotlar
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sarlavha
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleInputChange("headline", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masalan: Senior Frontend Developer"
              maxLength="200"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.headline.length}/200
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Haqida
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="O'zingiz haqingizda yozing..."
              maxLength="2000"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/2000
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Ko'nikmalar</h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ko'nikma qo'shing..."
              />
              <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Tillar</h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <select
                value={newLanguage.language}
                onChange={(e) =>
                  setNewLanguage((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Til tanlang</option>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <select
                value={newLanguage.level}
                onChange={(e) =>
                  setNewLanguage((prev) => ({ ...prev, level: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {languageLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleAddLanguage}
                disabled={!newLanguage.language}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.languages.length > 0 && (
              <div className="space-y-2">
                {formData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">
                        {
                          languages.find((l) => l.value === lang.language)
                            ?.label
                        }
                      </span>
                      <span className="text-gray-500 ml-2">
                        (
                        {
                          languageLevels.find((l) => l.value === lang.level)
                            ?.label
                        }
                        )
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Ijtimoiy tarmoqlar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "website", label: "Veb-sayt", icon: Globe },
              { key: "linkedin", label: "LinkedIn", icon: Globe },
              { key: "telegram", label: "Telegram", icon: Phone },
              { key: "instagram", label: "Instagram", icon: Globe },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon className="w-4 h-4 inline mr-1" />
                  {label}
                </label>
                <input
                  type="url"
                  value={formData.social[key] || ""}
                  onChange={(e) =>
                    handleNestedInputChange("social", key, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`${label} linkingizni kiriting`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Bekor qilish
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || !formData.name.trim() || !formData.city}
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saqlanmoqda...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Saqlash
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  User,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { fetchCategories } from "../../store/categoriesSlice";
import { fetchSpecialists } from "../../store/specialistsSlice";
import { createBooking } from "../../store/bookingsSlice";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";
import Avatar from "../UI/Avatar";
import { CITIES } from "../../utils/constants";

const BookingForm = ({ specialistId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { specialists } = useSelector((state) => state.specialists);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    specialist: specialistId || "",
    category: "",
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: { value: 1, unit: "hours" },
    budget: { min: "", max: "", currency: "UZS" },
    location: {
      type: "onsite",
      address: "",
      city: user?.city || "",
      coordinates: [],
    },
    isRemoteWork: false,
    priority: "medium",
    milestones: [],
    tags: [],
    requirements: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (specialists.length === 0) {
      dispatch(fetchSpecialists({ limit: 50 }));
    }
  }, [dispatch, categories.length, specialists.length]);

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = "Loyiha nomi majburiy";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Tavsif majburiy";
        }
        if (!formData.category) {
          newErrors.category = "Kategoriya tanlang";
        }
        break;

      case 2:
        if (!formData.specialist) {
          newErrors.specialist = "Mutaxassis tanlang";
        }
        break;

      case 3:
        if (!formData.scheduledDate) {
          newErrors.scheduledDate = "Sana tanlang";
        }
        if (!formData.scheduledTime) {
          newErrors.scheduledTime = "Vaqt tanlang";
        }
        if (!formData.location.address && !formData.isRemoteWork) {
          newErrors.address = "Manzil kiriting yoki masofaviy ish tanlang";
        }
        break;

      case 4:
        if (!formData.budget.min && !formData.budget.max) {
          newErrors.budget = "Byudjet oralig'ini kiriting";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { title: "", description: "", dueDate: "", payment: { amount: 0 } },
      ],
    }));
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        scheduledDate: new Date(
          `${formData.scheduledDate}T${formData.scheduledTime}`
        ),
        budget: {
          min: parseInt(formData.budget.min) || 0,
          max: parseInt(formData.budget.max) || 0,
          currency: formData.budget.currency,
        },
      };

      const result = await dispatch(createBooking(bookingData));

      if (result.type === "bookings/create/fulfilled") {
        if (onSuccess) onSuccess(result.payload);
        if (onClose) onClose();
      }
    } catch (error) {
      setErrors({ submit: "Loyiha yaratishda xato yuz berdi" });
    } finally {
      setLoading(false);
    }
  };

  const selectedSpecialist = specialists.find(
    (s) => s._id === formData.specialist
  );
  const selectedCategory = categories.find((c) => c._id === formData.category);

  const steps = [
    { number: 1, title: "Loyiha ma'lumotlari", icon: FileText },
    { number: 2, title: "Mutaxassis tanlash", icon: User },
    { number: 3, title: "Vaqt va joylashuv", icon: Calendar },
    { number: 4, title: "Byudjet va yakunlash", icon: DollarSign },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = step === stepItem.number;
          const isCompleted = step > stepItem.number;

          return (
            <div key={stepItem.number} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${
                  isActive
                    ? "border-blue-500 bg-blue-500 text-white"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 text-gray-400"
                }
              `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <div
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {stepItem.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                  w-12 h-0.5 mx-4 transition-colors
                  ${isCompleted ? "bg-green-500" : "bg-gray-300"}
                `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Loyiha ma'lumotlari
              </h2>
              <p className="text-gray-600 mb-6">
                Loyihangiz haqida to'liq ma'lumot bering
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loyiha nomi *
              </label>
              <Input
                type="text"
                placeholder="Masalan: Veb-sayt yaratish"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={errors.title}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Kategoriya tanlang</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.names?.uz || category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batafsil tavsif *
              </label>
              <textarea
                rows={4}
                placeholder="Loyihangiz haqida batafsil yozing..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qo'shimcha talablar
              </label>
              <textarea
                rows={3}
                placeholder="Maxsus talablar, texnologiyalar, yoki boshqa muhim ma'lumotlar..."
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mutaxassis tanlash
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedCategory
                  ? `${selectedCategory.names?.uz} kategoriyasidagi mutaxassislar`
                  : "Mutaxassis tanlang"}
              </p>
            </div>

            {specialists.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {specialists
                  .filter(
                    (specialist) =>
                      !formData.category ||
                      specialist.categories?.some(
                        (cat) => cat.category === formData.category
                      )
                  )
                  .map((specialist) => (
                    <div
                      key={specialist._id}
                      onClick={() =>
                        handleInputChange("specialist", specialist._id)
                      }
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.specialist === specialist._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar
                          src={specialist.profileImage}
                          alt={specialist.name}
                          size="md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {specialist.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {specialist.headline}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>⭐ {specialist.rating?.average || 0}/5</span>
                            <span>📍 {specialist.city}</span>
                            <span>
                              ✅ {specialist.stats?.completedProjects || 0}{" "}
                              loyiha
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Mutaxassislar yuklanmoqda...</p>
              </div>
            )}

            {errors.specialist && (
              <p className="text-red-500 text-sm">{errors.specialist}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Vaqt va joylashuv
              </h2>
              <p className="text-gray-600 mb-6">
                Loyiha uchun vaqt va joyni belgilang
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boshlanish sanasi *
                </label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    handleInputChange("scheduledDate", e.target.value)
                  }
                  error={errors.scheduledDate}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boshlanish vaqti *
                </label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    handleInputChange("scheduledTime", e.target.value)
                  }
                  error={errors.scheduledTime}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxminiy davomiyligi
              </label>
              <div className="flex space-x-4">
                <Input
                  type="number"
                  min="1"
                  value={formData.estimatedDuration.value}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "estimatedDuration",
                      "value",
                      parseInt(e.target.value)
                    )
                  }
                  className="flex-1"
                />
                <select
                  value={formData.estimatedDuration.unit}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "estimatedDuration",
                      "unit",
                      e.target.value
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hours">Soat</option>
                  <option value="days">Kun</option>
                  <option value="weeks">Hafta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isRemoteWork}
                  onChange={(e) =>
                    handleInputChange("isRemoteWork", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Masofaviy ish (onlayn)
                </span>
              </label>
            </div>

            {!formData.isRemoteWork && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shahar
                  </label>
                  <select
                    value={formData.location.city}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "city",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Shahar tanlang</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manzil *
                  </label>
                  <Input
                    type="text"
                    placeholder="To'liq manzil kiriting"
                    value={formData.location.address}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "location",
                        "address",
                        e.target.value
                      )
                    }
                    error={errors.address}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Byudjet va yakunlash
              </h2>
              <p className="text-gray-600 mb-6">
                Loyiha byudjetini belgilang va ma'lumotlarni tasdiqlang
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Byudjet oralig'i (so'm) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Dan"
                  value={formData.budget.min}
                  onChange={(e) =>
                    handleNestedInputChange("budget", "min", e.target.value)
                  }
                  error={errors.budget}
                />
                <Input
                  type="number"
                  placeholder="Gacha"
                  value={formData.budget.max}
                  onChange={(e) =>
                    handleNestedInputChange("budget", "max", e.target.value)
                  }
                />
              </div>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muhimlik darajasi
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Past</option>
                <option value="medium">O'rta</option>
                <option value="high">Yuqori</option>
                <option value="urgent">Shoshilinch</option>
              </select>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bosqichlar (ixtiyoriy)
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bosqich qo'shish
                </Button>
              </div>

              {formData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      Bosqich {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Bosqich nomi"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Bosqich tavsifi"
                      value={milestone.description}
                      onChange={(e) =>
                        updateMilestone(index, "description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        placeholder="Muddat"
                        value={milestone.dueDate}
                        onChange={(e) =>
                          updateMilestone(index, "dueDate", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="To'lov (so'm)"
                        value={milestone.payment?.amount || ""}
                        onChange={(e) =>
                          updateMilestone(index, "payment", {
                            amount: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {selectedSpecialist && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Loyiha xulosasi
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mutaxassis:</span>
                    <span className="font-medium">
                      {selectedSpecialist.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategoriya:</span>
                    <span className="font-medium">
                      {selectedCategory?.names?.uz}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sana:</span>
                    <span className="font-medium">
                      {formData.scheduledDate} {formData.scheduledTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Byudjet:</span>
                    <span className="font-medium">
                      {formData.budget.min} - {formData.budget.max} so'm
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                Orqaga
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext}>Davom etish</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Yuklanmoqda..." : "Loyihani yaratish"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingForm;

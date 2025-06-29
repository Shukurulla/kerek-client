import React, { useState, useRef } from "react";
import { Star, Upload, X, Image as ImageIcon } from "lucide-react";
import Button from "../UI/Button";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

const ReviewForm = ({
  specialist,
  onSubmit,
  onCancel,
  initialData = null,
  projectInfo = null,
}) => {
  const { request } = useApi();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    rating: {
      overall: initialData?.rating?.overall || 5,
      quality: initialData?.rating?.quality || 5,
      communication: initialData?.rating?.communication || 5,
      timeliness: initialData?.rating?.timeliness || 5,
      professionalism: initialData?.rating?.professionalism || 5,
    },
    comment: initialData?.comment || "",
    projectInfo: {
      title: initialData?.projectInfo?.title || projectInfo?.title || "",
      duration: initialData?.projectInfo?.duration || "",
      budget: initialData?.projectInfo?.budget || "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showDetailedRatings, setShowDetailedRatings] = useState(false);

  const ratingLabels = {
    overall: "Umumiy baho",
    quality: "Ish sifati",
    communication: "Muloqot",
    timeliness: "Vaqtni saqlash",
    professionalism: "Professionallik",
  };

  const handleRatingChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: value,
      },
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} fayli 5MB dan katta`, "error");
        return;
      }

      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        showToast(`${file.name} rasm yoki video fayli emas`, "error");
        return;
      }

      setSelectedFiles((prev) => [
        ...prev,
        {
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          name: file.name,
          type: file.type.startsWith("image/") ? "image" : "video",
        },
      ]);
    });

    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      showToast("Iltimos, sharh yozing", "error");
      return;
    }

    try {
      setUploading(true);

      const submitData = new FormData();

      // Add rating data
      submitData.append("specialist", specialist._id);
      submitData.append("rating", JSON.stringify(formData.rating));
      submitData.append("comment", formData.comment.trim());

      // Add project info if available
      if (
        formData.projectInfo.title ||
        formData.projectInfo.duration ||
        formData.projectInfo.budget
      ) {
        submitData.append("projectInfo", JSON.stringify(formData.projectInfo));
      }

      // Add files
      selectedFiles.forEach((fileObj, index) => {
        submitData.append("media", fileObj.file);
      });

      let response;
      if (initialData) {
        // Update existing review
        response = await request(`/reviews/${initialData._id}`, {
          method: "PUT",
          data: submitData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new review
        response = await request("/reviews", {
          method: "POST",
          data: submitData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      showToast(
        initialData ? "Baholash yangilandi" : "Baholash yuborildi",
        "success"
      );

      if (onSubmit) {
        onSubmit(response.review);
      }
    } catch (error) {
      showToast(
        initialData
          ? "Baholashni yangilashda xato"
          : "Baholash yuborishda xato",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const RatingStars = ({ category, value, onChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(category, star)}
          className="transition-colors"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? "text-yellow-400 fill-current"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 min-w-8">{value}/5</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {initialData ? "Baholashni tahrirlash" : "Baholash yozing"}
      </h3>

      {/* Specialist info */}
      <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <img
          src={specialist.profileImage || "/default-avatar.png"}
          alt={specialist.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-medium text-gray-900">{specialist.name}</h4>
          <p className="text-sm text-gray-600">{specialist.city}</p>
          {specialist.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {specialist.rating.average} ({specialist.rating.count})
              </span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {ratingLabels.overall} *
          </label>
          <RatingStars
            category="overall"
            value={formData.rating.overall}
            onChange={handleRatingChange}
          />
        </div>

        {/* Detailed Ratings Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowDetailedRatings(!showDetailedRatings)}
            className="text-blue-600 text-sm hover:underline"
          >
            {showDetailedRatings
              ? "Batafsil baholashni yashirish"
              : "Batafsil baholash"}
          </button>
        </div>

        {/* Detailed Ratings */}
        {showDetailedRatings && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {Object.entries(ratingLabels).map(([category, label]) => {
              if (category === "overall") return null;

              return (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <RatingStars
                    category={category}
                    value={formData.rating[category]}
                    onChange={handleRatingChange}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Project Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Loyiha ma'lumotlari (ixtiyoriy)
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loyiha nomi
            </label>
            <input
              type="text"
              value={formData.projectInfo.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  projectInfo: {
                    ...prev.projectInfo,
                    title: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Loyiha nomini kiriting..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Davomiyligi
              </label>
              <input
                type="text"
                value={formData.projectInfo.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectInfo: {
                      ...prev.projectInfo,
                      duration: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masalan: 2 hafta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Byudjet (so'm)
              </label>
              <input
                type="number"
                value={formData.projectInfo.budget}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectInfo: {
                      ...prev.projectInfo,
                      budget: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sharh *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mutaxassis bilan ishlash tajribangiz haqida yozing..."
            maxLength="1000"
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.comment.length}/1000
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rasm yoki videolar (ixtiyoriy)
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Rasm yoki videolarni yuklang
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Fayllarni tanlash
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Maksimal: 5MB, PNG, JPG, MP4 formatlar
            </p>
          </div>

          {/* File previews */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedFiles.map((fileObj, index) => (
                <div key={index} className="relative">
                  {fileObj.type === "image" ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📹</div>
                        <div className="text-xs text-gray-600 truncate max-w-16">
                          {fileObj.name}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={uploading}
          >
            Bekor qilish
          </Button>

          <Button
            type="submit"
            disabled={!formData.comment.trim() || uploading}
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {initialData ? "Yangilanmoqda..." : "Yuborilmoqda..."}
              </div>
            ) : initialData ? (
              "Yangilash"
            ) : (
              "Baholash yuborish"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

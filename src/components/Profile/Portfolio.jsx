import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Upload,
  X,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import Modal from "../UI/Modal";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

const Portfolio = ({ user, categories, onUpdate, isOwner = false }) => {
  const { request } = useApi();
  const { showToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    client: "",
    projectDate: "",
    technologies: [],
    url: "",
    images: [],
  });

  const [newTech, setNewTech] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const resetForm = () => {
    setFormData({
      categoryId: "",
      title: "",
      description: "",
      client: "",
      projectDate: "",
      technologies: [],
      url: "",
      images: [],
    });
    setSelectedFiles([]);
    setNewTech("");
    setEditingItem(null);
  };

  const handleAddItem = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditItem = (categoryIndex, itemIndex) => {
    const category = user.categories[categoryIndex];
    const item = category.portfolio[itemIndex];

    setFormData({
      categoryId: category.category._id,
      title: item.title || "",
      description: item.description || "",
      client: item.client || "",
      projectDate: item.projectDate ? item.projectDate.split("T")[0] : "",
      technologies: item.technologies || [],
      url: item.url || "",
      images: item.images || [],
    });

    setEditingItem({ categoryIndex, itemIndex });
    setShowAddModal(true);
  };

  const handleDeleteItem = async (categoryIndex, itemIndex) => {
    if (!confirm("Portfolio elementini o'chirishni xohlaysizmi?")) return;

    try {
      // Bu yerda backend API chaqiruvi bo'lishi kerak
      // Hozircha frontend simulation
      showToast("Portfolio elementi o'chirildi", "success");
      onUpdate?.();
    } catch (error) {
      showToast("O'chirishda xato", "error");
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} fayli 5MB dan katta`, "error");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast(`${file.name} rasm fayli emas`, "error");
        return;
      }

      setSelectedFiles((prev) => [
        ...prev,
        {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        },
      ]);
    });

    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const handleRemoveTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.categoryId) {
      showToast("Majburiy maydonlarni to'ldiring", "error");
      return;
    }

    try {
      setUploading(true);

      const submitData = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        if (key === "technologies") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== "images") {
          submitData.append(key, formData[key]);
        }
      });

      // Add files
      selectedFiles.forEach((fileObj) => {
        submitData.append("portfolio", fileObj.file);
      });

      const endpoint = editingItem
        ? `/users/categories/${formData.categoryId}/portfolio/${editingItem.itemIndex}`
        : `/users/categories/${formData.categoryId}/portfolio`;

      const method = editingItem ? "PUT" : "POST";

      await request(endpoint, {
        method,
        data: submitData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast(
        editingItem ? "Portfolio yangilandi" : "Portfolio qo'shildi",
        "success"
      );

      setShowAddModal(false);
      resetForm();
      onUpdate?.();
    } catch (error) {
      showToast("Xato yuz berdi", "error");
    } finally {
      setUploading(false);
    }
  };

  const filteredCategories = selectedCategory
    ? user.categories?.filter((cat) => cat.category._id === selectedCategory)
    : user.categories;

  const getAllPortfolioItems = () => {
    return (
      user.categories?.reduce((items, category, categoryIndex) => {
        if (category.portfolio) {
          category.portfolio.forEach((item, itemIndex) => {
            items.push({
              ...item,
              categoryIndex,
              itemIndex,
              categoryName: category.category.names?.uz,
            });
          });
        }
        return items;
      }, []) || []
    );
  };

  const portfolioItems = getAllPortfolioItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-gray-600">
            {portfolioItems.length} ta ish namunasi
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Barcha kategoriyalar</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.names.uz}
              </option>
            ))}
          </select>

          {isOwner && (
            <Button onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              Qo'shish
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Grid */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <div className="text-sm">Rasm yo'q</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {isOwner && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() =>
                        handleEditItem(item.categoryIndex, item.itemIndex)
                      }
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteItem(item.categoryIndex, item.itemIndex)
                      }
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}

                {/* View button */}
                <div className="absolute bottom-2 right-2">
                  <button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {item.categoryName}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="space-y-2 text-sm text-gray-500">
                  {item.client && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{item.client}</span>
                    </div>
                  )}

                  {item.projectDate && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.projectDate).getFullYear()}</span>
                    </div>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span>Ko'rish</span>
                    </a>
                  )}
                </div>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.technologies.slice(0, 3).map((tech, techIndex) => (
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Portfolio bo'sh
          </h3>
          <p className="text-gray-500 mb-4">
            {isOwner
              ? "Ish namunalaringizni qo'shing va mijozlarni hayratda qoldiring"
              : "Hozircha portfolio ishlar yo'q"}
          </p>
          {isOwner && (
            <Button onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              Birinchi ishni qo'shish
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={editingItem ? "Portfolio tahrirlash" : "Portfolio qo'shish"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoriya *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Kategoriya tanlang</option>
              {user.categories?.map((category) => (
                <option
                  key={category.category._id}
                  value={category.category._id}
                >
                  {category.category.names.uz}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loyiha nomi *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Loyiha nomini kiriting..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Loyiha haqida qisqacha ma'lumot..."
            />
          </div>

          {/* Client and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mijoz
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mijoz nomi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loyiha sanasi
              </label>
              <input
                type="date"
                value={formData.projectDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loyiha URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texnologiyalar
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddTechnology())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Node.js, MongoDB..."
                />
                <Button
                  type="button"
                  onClick={handleAddTechnology}
                  disabled={!newTech.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(index)}
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rasmlar
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="portfolio-images"
              />

              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Loyiha rasmlarini yuklang
              </p>
              <label
                htmlFor="portfolio-images"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Fayllarni tanlash
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG (maks. 5MB har biri)
              </p>
            </div>

            {/* File previews */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedFiles.map((fileObj, index) => (
                  <div key={index} className="relative">
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing images for edit mode */}
            {editingItem && formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Mavjud rasmlar:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Mavjud rasm ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              disabled={uploading}
            >
              Bekor qilish
            </Button>

            <Button
              type="submit"
              disabled={
                !formData.title.trim() || !formData.categoryId || uploading
              }
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingItem ? "Yangilanmoqda..." : "Qo'shilmoqda..."}
                </div>
              ) : editingItem ? (
                "Yangilash"
              ) : (
                "Qo'shish"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Portfolio;

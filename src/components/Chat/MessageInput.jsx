import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  Smile,
  X,
  FileText,
  Download,
} from "lucide-react";
import Button from "../UI/Button";

const MessageInput = ({ onSendMessage, onFileUpload, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const emojis = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤗",
    "🤔",
    "😐",
    "😴",
    "😎",
    "🤩",
    "🥳",
    "😭",
    "😱",
    "😡",
    "🤬",
    "😇",
    "🤡",
    "🥵",
    "🥶",
    "😵",
    "👍",
    "👎",
    "👌",
    "🤝",
    "🙏",
    "💪",
    "👏",
    "🤦",
    "🤷",
    "💯",
    "❤️",
    "💙",
    "💚",
    "💛",
    "🧡",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "🔥",
    "⭐",
    "🎉",
    "🎊",
    "💎",
    "🌟",
    "✨",
    "⚡",
    "💥",
    "💫",
  ];

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleSend = () => {
    if ((!message.trim() && selectedFiles.length === 0) || disabled) return;

    if (selectedFiles.length > 0) {
      // Send files
      selectedFiles.forEach((file) => {
        onFileUpload(file, message.trim());
      });
      setSelectedFiles([]);
    } else {
      // Send text message
      onSendMessage(message.trim());
    }

    setMessage("");
    resetTextareaHeight();
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(
          `${file.name} fayli 10MB dan katta. Iltimos, kichikroq fayl tanlang.`
        );
        return;
      }

      // Validate file type
      if (type === "image" && !file.type.startsWith("image/")) {
        alert(`${file.name} rasm fayli emas.`);
        return;
      }

      setSelectedFiles((prev) => [
        ...prev,
        {
          file,
          type: file.type.startsWith("image/") ? "image" : "file",
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          name: file.name,
          size: file.size,
        },
      ]);
    });

    // Reset input
    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      // Revoke object URL to prevent memory leak
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);

    setMessage(newMessage);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative">
      {/* File previews */}
      {selectedFiles.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((fileObj, index) => (
              <div key={index} className="relative">
                {fileObj.type === "image" ? (
                  <div className="relative">
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex items-center p-2 bg-white border border-gray-300 rounded-lg min-w-48">
                    <FileText className="w-8 h-8 text-blue-500 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileObj.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileObj.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-10 gap-1 max-w-80">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 text-lg hover:bg-gray-100 rounded flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2 p-3 border-t border-gray-200">
        {/* File upload buttons */}
        <div className="flex space-x-1">
          {/* Image upload */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e, "image")}
            className="hidden"
          />
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* File upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            multiple
            onChange={(e) => handleFileSelect(e, "file")}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Xabar yozing..."
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            style={{
              minHeight: "44px",
              maxHeight: "120px",
            }}
          />

          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && selectedFiles.length === 0) || disabled}
          className="px-4 py-3 min-w-12"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Character count (optional) */}
      {message.length > 800 && (
        <div className="absolute bottom-16 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
          {message.length}/1000
        </div>
      )}
    </div>
  );
};

export default MessageInput;

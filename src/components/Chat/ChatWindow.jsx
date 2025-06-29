import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Info,
} from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Avatar from "../UI/Avatar";
import Button from "../UI/Button";

const ChatWindow = ({ chat }) => {
  const { user } = useSelector((state) => state.auth);
  const [showInfo, setShowInfo] = useState(false);

  const otherParticipant = chat.participants.find((p) => p._id !== user._id);

  // Mock messages - replace with real data
  const mockMessages = [
    {
      _id: "1",
      sender: { _id: user._id, name: user.name },
      content: "Salom! Loyiha haqida gaplashsak bo'ladimi?",
      type: "text",
      timestamp: new Date("2024-01-15T10:30:00"),
      isRead: true,
    },
    {
      _id: "2",
      sender: { _id: otherParticipant._id, name: otherParticipant.name },
      content: "Albatta! Qanday loyiha haqida gap ketmoqda?",
      type: "text",
      timestamp: new Date("2024-01-15T10:32:00"),
      isRead: true,
    },
    {
      _id: "3",
      sender: { _id: user._id, name: user.name },
      content:
        "Biznesim uchun zamonaviy veb-sayt kerak. E-commerce funksiyalari bilan.",
      type: "text",
      timestamp: new Date("2024-01-15T10:35:00"),
      isRead: false,
    },
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToday = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    return today.toDateString() === messageDate.toDateString();
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    if (isToday(timestamp)) {
      return "Bugun";
    }
    return messageDate.toLocaleDateString("uz-UZ", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                src={otherParticipant?.profileImage}
                alt={otherParticipant?.name}
                size="md"
              />
              {otherParticipant?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {otherParticipant?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {otherParticipant?.isOnline
                  ? "Online"
                  : "Oxirgi marta faol edi..."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <MessageList messages={mockMessages} currentUserId={user._id} />
          <MessageInput
            onSendMessage={(message) => console.log("Send message:", message)}
            onSendFile={(file) => console.log("Send file:", file)}
          />
        </div>

        {/* Info Sidebar */}
        {showInfo && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <Avatar
                  src={otherParticipant?.profileImage}
                  alt={otherParticipant?.name}
                  size="xl"
                  className="mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900">
                  {otherParticipant?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {otherParticipant?.headline || "Mutaxassis"}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Telefon qilish
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Video qo'ng'iroq
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Profil ko'rish
                </Button>
              </div>

              {/* Shared Files */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Umumiy fayllar
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      loyiha-taklif.pdf
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      dizayn-mockup.png
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sozlamalar</h4>
                <div className="space-y-2 text-sm">
                  <button className="text-left text-gray-600 hover:text-gray-900">
                    Bildirishnomalarni o'chirish
                  </button>
                  <button className="text-left text-gray-600 hover:text-gray-900">
                    Suhbat tarixini tozalash
                  </button>
                  <button className="text-left text-red-600 hover:text-red-700">
                    Suhbatni bloklash
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;

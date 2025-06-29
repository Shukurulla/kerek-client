import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  MessageCircle,
  Search,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Users,
} from "lucide-react";
import ChatWindow from "../components/Chat/ChatWindow";
import Avatar from "../components/UI/Avatar";
import Button from "../components/UI/Button";
import { useApi } from "../hooks/useApi";
import { useSocket } from "../hooks/useSocket";
import { useToast } from "../hooks/useToast";

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { request } = useApi();
  const { socket, isConnected } = useSocket();
  const { showToast } = useToast();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchChats();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new messages
      socket.on("new_message", handleNewMessage);
      socket.on("user_online", handleUserOnline);
      socket.on("user_offline", handleUserOffline);
      socket.on("message_read", handleMessageRead);

      return () => {
        socket.off("new_message", handleNewMessage);
        socket.off("user_online", handleUserOnline);
        socket.off("user_offline", handleUserOffline);
        socket.off("message_read", handleMessageRead);
      };
    }
  }, [socket, isConnected]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await request("/chat");
      setChats(response || []);
    } catch (error) {
      showToast("Chatlarni yuklashda xato", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await request("/chat/unread-count");
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Unread count fetch error:", error);
    }
  };

  const handleNewMessage = (messageData) => {
    // Update chat list with new message
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat._id === messageData.chatId) {
          return {
            ...chat,
            lastMessage: {
              content: messageData.content,
              sender: messageData.sender,
              timestamp: messageData.timestamp,
            },
            // Increment unread if not current chat
            unreadCount:
              selectedChat?._id === chat._id ? 0 : (chat.unreadCount || 0) + 1,
          };
        }
        return chat;
      });
    });

    // Update unread count
    if (selectedChat?._id !== messageData.chatId) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const handleUserOnline = (userId) => {
    setOnlineUsers((prev) => new Set([...prev, userId]));
  };

  const handleUserOffline = (userId) => {
    setOnlineUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const handleMessageRead = (data) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat._id === data.chatId) {
          return {
            ...chat,
            unreadCount: 0,
          };
        }
        return chat;
      });
    });
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);

    // Mark as read
    if (chat.unreadCount > 0) {
      markChatAsRead(chat._id);
    }
  };

  const markChatAsRead = async (chatId) => {
    try {
      await request(`/chat/${chatId}/read`, { method: "POST" });

      // Update local state
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === chatId) {
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        });
      });

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const createNewChat = async (participantId) => {
    try {
      const response = await request("/chat/create", {
        method: "POST",
        data: { participantId },
      });

      setChats((prev) => [response, ...prev]);
      setSelectedChat(response);
      showToast("Yangi chat yaratildi", "success");
    } catch (error) {
      showToast("Chat yaratishda xato", "error");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const getOtherParticipant = (chat) => {
    return chat.participants?.find((p) => p._id !== user._id);
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;

    const otherParticipant = getOtherParticipant(chat);
    return (
      otherParticipant?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const ChatListItem = ({ chat }) => {
    const otherParticipant = getOtherParticipant(chat);
    const isOnline = isUserOnline(otherParticipant?._id);
    const isSelected = selectedChat?._id === chat._id;

    return (
      <div
        onClick={() => handleChatSelect(chat)}
        className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
          isSelected ? "bg-blue-50 border-blue-200" : ""
        }`}
      >
        <div className="relative">
          <Avatar
            src={otherParticipant?.profileImage}
            name={otherParticipant?.name}
            size="md"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              className={`text-sm font-medium truncate ${
                isSelected ? "text-blue-900" : "text-gray-900"
              }`}
            >
              {otherParticipant?.name}
            </h3>
            {chat.lastMessage && (
              <span className="text-xs text-gray-500">
                {formatTime(chat.lastMessage.timestamp)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600 truncate">
              {chat.lastMessage?.content || "Xabar yo'q"}
            </p>
            {chat.unreadCount > 0 && (
              <div className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ChatSidebar = () => (
    <div
      className={`${
        isMobile && selectedChat ? "hidden" : "block"
      } w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Xabarlar</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Connection status */}
      {!isConnected && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-yellow-700">Ulanishda...</span>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem key={chat._id} chat={chat} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "Topilmadi" : "Xabarlar yo'q"}
            </h3>
            <p className="text-center">
              {searchQuery
                ? "Qidiruv bo'yicha natija topilmadi"
                : "Yangi suhbat boshlash uchun mutaxassis bilan bog'laning"}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredChats.length} ta chat</span>
          <span className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            {isConnected ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Suhbatni tanlang
        </h2>
        <p className="text-gray-500 mb-4">
          Xabar yuborish uchun chap tarafdan suhbatni tanlang
        </p>
        <Button onClick={() => (window.location.href = "/specialists")}>
          <Users className="w-4 h-4 mr-2" />
          Mutaxassis qidirish
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Chat Sidebar */}
        <ChatSidebar />

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {isMobile && selectedChat && (
            <div className="md:hidden p-4 border-b border-gray-200 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Orqaga
              </Button>
            </div>
          )}

          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              onClose={isMobile ? () => setSelectedChat(null) : null}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

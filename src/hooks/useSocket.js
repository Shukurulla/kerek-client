import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { updateOnlineStatus } from "../store/authSlice";
import { useToast } from "./useToast";

const useSocket = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if user is not authenticated
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const initSocket = () => {
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      socket.current = io(socketUrl, {
        auth: {
          token: localStorage.getItem("token"),
          userId: user._id,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      // Connection events
      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
        setIsConnected(true);
        setReconnectAttempts(0);

        // Join user room
        socket.current.emit("join", user._id);

        // Update online status
        dispatch(updateOnlineStatus(true));
      });

      socket.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        dispatch(updateOnlineStatus(false));
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);

        // Increment reconnect attempts
        setReconnectAttempts((prev) => prev + 1);

        // Show error after multiple failed attempts
        if (reconnectAttempts > 3) {
          showToast("Ulanishda muammo", "error");
        }
      });

      // Message events
      socket.current.on("new_message", (data) => {
        // Handle incoming messages
        console.log("New message received:", data);

        // Show notification if not on chat page
        if (!window.location.pathname.includes("/chat")) {
          showToast(`${data.senderName} dan yangi xabar`, "info");
        }

        // You can dispatch to Redux store here
        // dispatch(addMessage(data));
      });

      // Booking events
      socket.current.on("booking_update", (data) => {
        console.log("Booking update:", data);

        const messages = {
          requested: "Yangi booking so'rovi",
          accepted: "Booking qabul qilindi",
          rejected: "Booking rad etildi",
          completed: "Booking tugallandi",
          cancelled: "Booking bekor qilindi",
        };

        showToast(messages[data.status] || "Booking yangilandi", "info");

        // Dispatch to Redux store
        // dispatch(updateBookingStatus(data));
      });

      // Notification events
      socket.current.on("notification", (data) => {
        console.log("Notification received:", data);

        showToast(data.message, data.type || "info");

        // Play notification sound
        if (data.playSound) {
          playNotificationSound();
        }
      });

      // User status events
      socket.current.on("user_online", (userId) => {
        console.log("User came online:", userId);
        // Update user online status in Redux
        // dispatch(setUserOnline(userId));
      });

      socket.current.on("user_offline", (userId) => {
        console.log("User went offline:", userId);
        // Update user offline status in Redux
        // dispatch(setUserOffline(userId));
      });

      // Typing events for chat
      socket.current.on("typing_start", (data) => {
        // Handle typing indicator
        console.log("User started typing:", data);
      });

      socket.current.on("typing_stop", (data) => {
        // Handle typing indicator stop
        console.log("User stopped typing:", data);
      });

      // Video call events (if implemented)
      socket.current.on("call_request", (data) => {
        console.log("Incoming call:", data);
        showToast(`${data.callerName} qo'ng'iroq qilmoqda`, "info");
      });

      // Error handling
      socket.current.on("error", (error) => {
        console.error("Socket error:", error);
        showToast("Xato yuz berdi", "error");
      });
    };

    initSocket();

    // Cleanup on unmount or user change
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, user, dispatch]);

  // Socket utility functions
  const emitEvent = (event, data) => {
    if (socket.current && isConnected) {
      socket.current.emit(event, data);
    } else {
      console.warn("Socket not connected");
    }
  };

  const sendMessage = (chatId, message, type = "text") => {
    emitEvent("send_message", {
      chatId,
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  };

  const joinRoom = (roomId) => {
    emitEvent("join_room", roomId);
  };

  const leaveRoom = (roomId) => {
    emitEvent("leave_room", roomId);
  };

  const startTyping = (chatId) => {
    emitEvent("typing_start", { chatId });
  };

  const stopTyping = (chatId) => {
    emitEvent("typing_stop", { chatId });
  };

  const updateUserStatus = (status) => {
    emitEvent("update_status", { status });
  };

  const sendNotification = (userId, notification) => {
    emitEvent("send_notification", {
      userId,
      notification,
    });
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      audio
        .play()
        .catch((e) => console.log("Could not play notification sound"));
    } catch (error) {
      console.log("Notification sound not available");
    }
  };

  // Listen for specific events
  const onEvent = (event, callback) => {
    if (socket.current) {
      socket.current.on(event, callback);
    }
  };

  const offEvent = (event, callback) => {
    if (socket.current) {
      socket.current.off(event, callback);
    }
  };

  // Reconnect manually
  const reconnect = () => {
    if (socket.current) {
      socket.current.connect();
    }
  };

  return {
    socket: socket.current,
    isConnected,
    reconnectAttempts,

    // Utility functions
    emitEvent,
    sendMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    updateUserStatus,
    sendNotification,
    onEvent,
    offEvent,
    reconnect,
  };
};

export { useSocket };

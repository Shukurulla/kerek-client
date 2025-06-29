import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.listeners = new Map();
    this.rooms = new Set();
  }

  // Initialize socket connection
  init(token, userId) {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    this.socket = io(socketUrl, {
      auth: {
        token,
        userId,
      },
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      autoConnect: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup default event listeners
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Rejoin rooms after reconnection
      this.rooms.forEach((room) => {
        this.socket.emit("join_room", room);
      });

      this.emit("socket_connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
      this.emit("socket_disconnected", reason);

      // Auto reconnect if disconnection was not intentional
      if (reason === "io server disconnect") {
        this.reconnect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnect();
        }, this.reconnectInterval * this.reconnectAttempts);
      } else {
        this.emit("socket_connection_failed", error);
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      this.emit("socket_error", error);
    });

    // Authentication error
    this.socket.on("auth_error", (error) => {
      console.error("Socket auth error:", error);
      this.emit("socket_auth_error", error);
      this.disconnect();
    });

    // Reconnection events
    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.emit("socket_reconnected", attemptNumber);
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
      this.emit("socket_reconnect_error", error);
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.rooms.clear();
      this.listeners.clear();
    }
  }

  // Reconnect socket
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Emit event
  emit(event, data = {}) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      return true;
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected`);
      return false;
    }
  }

  // Listen to events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store callback for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
    }
  }

  // Remove event listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove from stored listeners
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  // Join a room
  joinRoom(room) {
    if (this.emit("join_room", room)) {
      this.rooms.add(room);
      return true;
    }
    return false;
  }

  // Leave a room
  leaveRoom(room) {
    if (this.emit("leave_room", room)) {
      this.rooms.delete(room);
      return true;
    }
    return false;
  }

  // Chat specific methods
  sendMessage(chatId, message, type = "text", metadata = {}) {
    return this.emit("send_message", {
      chatId,
      content: message,
      type,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  // Typing indicators
  startTyping(chatId) {
    return this.emit("typing_start", { chatId });
  }

  stopTyping(chatId) {
    return this.emit("typing_stop", { chatId });
  }

  // User status
  updateUserStatus(status) {
    return this.emit("update_status", { status });
  }

  setUserOnline() {
    return this.emit("user_online");
  }

  setUserOffline() {
    return this.emit("user_offline");
  }

  // Booking related events
  updateBookingStatus(bookingId, status, data = {}) {
    return this.emit("booking_status_update", {
      bookingId,
      status,
      ...data,
    });
  }

  sendBookingNotification(userId, notification) {
    return this.emit("booking_notification", {
      userId,
      notification,
    });
  }

  // Notification methods
  sendNotification(userId, notification) {
    return this.emit("send_notification", {
      userId,
      notification: {
        ...notification,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Call/Video methods (if implemented)
  initiateCall(userId, type = "audio") {
    return this.emit("call_initiate", {
      userId,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  acceptCall(callId) {
    return this.emit("call_accept", { callId });
  }

  rejectCall(callId) {
    return this.emit("call_reject", { callId });
  }

  endCall(callId) {
    return this.emit("call_end", { callId });
  }

  // File sharing
  sendFile(chatId, fileData) {
    return this.emit("send_file", {
      chatId,
      fileData,
      timestamp: new Date().toISOString(),
    });
  }

  // Location sharing
  shareLocation(chatId, location) {
    return this.emit("share_location", {
      chatId,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Group chat methods
  createGroup(groupData) {
    return this.emit("create_group", groupData);
  }

  joinGroup(groupId) {
    return this.emit("join_group", { groupId });
  }

  leaveGroup(groupId) {
    return this.emit("leave_group", { groupId });
  }

  updateGroup(groupId, updates) {
    return this.emit("update_group", { groupId, updates });
  }

  // Admin/Moderation methods
  banUser(userId, reason) {
    return this.emit("ban_user", { userId, reason });
  }

  unbanUser(userId) {
    return this.emit("unban_user", { userId });
  }

  // Utility methods
  getSocketId() {
    return this.socket?.id;
  }

  getReconnectAttempts() {
    return this.reconnectAttempts;
  }

  getRooms() {
    return Array.from(this.rooms);
  }

  // Event listener helpers
  onMessage(callback) {
    this.on("new_message", callback);
  }

  onUserOnline(callback) {
    this.on("user_online", callback);
  }

  onUserOffline(callback) {
    this.on("user_offline", callback);
  }

  onTyping(callback) {
    this.on("typing_start", callback);
    this.on("typing_stop", callback);
  }

  onBookingUpdate(callback) {
    this.on("booking_update", callback);
  }

  onNotification(callback) {
    this.on("notification", callback);
  }

  onCall(callback) {
    this.on("call_request", callback);
    this.on("call_accepted", callback);
    this.on("call_rejected", callback);
    this.on("call_ended", callback);
  }

  // Connection state helpers
  onConnect(callback) {
    this.on("socket_connected", callback);
  }

  onDisconnect(callback) {
    this.on("socket_disconnected", callback);
  }

  onError(callback) {
    this.on("socket_error", callback);
  }

  onReconnect(callback) {
    this.on("socket_reconnected", callback);
  }

  // Cleanup method
  cleanup() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.off(event, callback);
      });
    });
    this.listeners.clear();
    this.rooms.clear();
  }
}

// Create and export singleton instance
const socketService = new SocketService();

export default socketService;

// Export class for testing or multiple instances
export { SocketService };

import React, { useEffect, useRef } from "react";
import { Check, CheckCheck, Download, Eye } from "lucide-react";
import Avatar from "../UI/Avatar";

const MessageList = ({
  messages,
  currentUserId,
  hasMore,
  onLoadMore,
  loading,
}) => {
  const containerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Intersection Observer for loading more messages
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  const formatMessageTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday =
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
      messageDate.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return (
        "Kecha " +
        messageDate.toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return messageDate.toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const shouldShowAvatar = (message, index) => {
    if (index === messages.length - 1) return true;

    const nextMessage = messages[index + 1];
    return nextMessage.sender._id !== message.sender._id;
  };

  const shouldShowTimestamp = (message, index) => {
    if (index === 0) return true;

    const prevMessage = messages[index - 1];
    const currentTime = new Date(message.createdAt);
    const prevTime = new Date(prevMessage.createdAt);

    // Show timestamp if messages are more than 5 minutes apart
    return currentTime - prevTime > 5 * 60 * 1000;
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: [message],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return groups;
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (dateString === today) return "Bugun";
    if (dateString === yesterday) return "Kecha";

    return date.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const MessageBubble = ({ message, isOwn, showAvatar, showTime }) => {
    return (
      <div className={`flex mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex max-w-xs lg:max-w-md ${
            isOwn ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isOwn ? "ml-2" : "mr-2"}`}>
            {showAvatar && !isOwn ? (
              <Avatar
                src={message.sender.profileImage}
                name={message.sender.name}
                size="sm"
              />
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>

          {/* Message Content */}
          <div
            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
          >
            {/* Sender name (only for received messages) */}
            {!isOwn && showAvatar && (
              <span className="text-xs text-gray-500 mb-1 px-1">
                {message.sender.name}
              </span>
            )}

            {/* Message bubble */}
            <div
              className={`relative px-3 py-2 rounded-2xl ${
                isOwn
                  ? "bg-blue-500 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              {message.type === "text" ? (
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              ) : message.type === "image" ? (
                <div className="relative">
                  <img
                    src={message.imageUrl}
                    alt="Yuborilgan rasm"
                    className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer"
                    onClick={() => window.open(message.imageUrl, "_blank")}
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => window.open(message.imageUrl, "_blank")}
                      className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={message.imageUrl}
                      download
                      className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-200 rounded-lg">📎</div>
                  <div>
                    <p className="text-sm font-medium">{message.fileName}</p>
                    <p className="text-xs text-gray-500">{message.fileSize}</p>
                  </div>
                </div>
              )}

              {/* Message status (only for own messages) */}
              {isOwn && (
                <div className="absolute -bottom-1 -right-1">
                  {message.isRead ? (
                    <CheckCheck className="h-4 w-4 text-blue-300" />
                  ) : (
                    <Check className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              )}
            </div>

            {/* Timestamp */}
            {showTime && (
              <span
                className={`text-xs text-gray-400 mt-1 px-1 ${
                  isOwn ? "text-right" : "text-left"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : (
            <button
              onClick={onLoadMore}
              className="text-blue-600 text-sm hover:underline"
            >
              Eski xabarlarni yuklash
            </button>
          )}
        </div>
      )}

      {/* Messages grouped by date */}
      {groupedMessages.map((group, groupIndex) => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {getDateLabel(group.date)}
            </span>
          </div>

          {/* Messages for this date */}
          {group.messages.map((message, messageIndex) => {
            const isOwn = message.sender._id === currentUserId;
            const globalIndex = messages.findIndex(
              (m) => m._id === message._id
            );
            const showAvatar = shouldShowAvatar(message, globalIndex);
            const showTime = shouldShowTimestamp(message, globalIndex);

            return (
              <MessageBubble
                key={message._id || messageIndex}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTime={showTime}
              />
            );
          })}
        </div>
      ))}

      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-center">
            Hozircha xabarlar yo'q
            <br />
            Birinchi xabarni yuboring!
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageList;

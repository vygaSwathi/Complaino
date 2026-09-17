import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSupport.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminSupport() {
  const navigate = useNavigate();

  const [chatMessages, setChatMessages] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("accessToken");

  // =========================================================
  // FETCH ALL CHATS
  // =========================================================

  const fetchChats = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/api/chat/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load chats");
      }

      setChatMessages(data.messages || []);
    } catch (error) {
      console.error("Fetch admin chats error:", error.message);
      setError(error.message || "Failed to load chats");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // =========================================================
  // INITIAL LOAD + AUTO REFRESH
  // =========================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchChats(true);

    const interval = setInterval(() => {
      fetchChats(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================================================
  // GROUP MESSAGES BY STUDENT
  // =========================================================

  const conversations = useMemo(() => {
    const grouped = {};

    chatMessages.forEach((chat) => {
      if (!chat.studentId) {
        return;
      }

      const studentId =
        typeof chat.studentId === "object"
          ? chat.studentId._id
          : chat.studentId;

      if (!studentId) {
        return;
      }

      if (!grouped[studentId]) {
        grouped[studentId] = {
          student:
            typeof chat.studentId === "object"
              ? chat.studentId
              : null,
          messages: [],
          unreadCount: 0,
        };
      }

      grouped[studentId].messages.push(chat);

      if (chat.sender === "student" && chat.isRead !== true) {
        grouped[studentId].unreadCount += 1;
      }
    });

    return Object.entries(grouped)
      .map(([studentId, conversation]) => {
        const sortedMessages = [...conversation.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        );

        const lastMessage =
          sortedMessages[sortedMessages.length - 1];

        return {
          studentId,
          student: conversation.student,
          messages: sortedMessages,
          lastMessage,
          unreadCount: conversation.unreadCount,
          lastTime: lastMessage?.createdAt || 0,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastTime).getTime() -
          new Date(a.lastTime).getTime()
      );
  }, [chatMessages]);

  // =========================================================
  // AUTO SELECT FIRST CONVERSATION
  // =========================================================

  useEffect(() => {
    if (
      conversations.length > 0 &&
      !selectedStudentId
    ) {
      handleSelectStudent(conversations[0].studentId);
    }
  }, [conversations, selectedStudentId]);

  // =========================================================
  // SELECTED CONVERSATION
  // =========================================================

  const selectedConversation = useMemo(() => {
    if (!selectedStudentId) {
      return null;
    }

    return (
      conversations.find(
        (conversation) =>
          conversation.studentId === selectedStudentId
      ) || null
    );
  }, [conversations, selectedStudentId]);

  // =========================================================
  // SELECT STUDENT
  // =========================================================

  const handleSelectStudent = async (studentId) => {
    setSelectedStudentId(studentId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/chat/admin/${studentId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark chat as read"
        );
      }

      setChatMessages((previousMessages) =>
        previousMessages.map((chat) => {
          const currentStudentId =
            typeof chat.studentId === "object"
              ? chat.studentId?._id
              : chat.studentId;

          if (
            currentStudentId === studentId &&
            chat.sender === "student"
          ) {
            return {
              ...chat,
              isRead: true,
            };
          }

          return chat;
        })
      );
    } catch (error) {
      console.error("Mark chat as read error:", error.message);
    }
  };

  // =========================================================
  // SEND ADMIN REPLY
  // =========================================================

  const handleSendReply = async (event) => {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply || !selectedStudentId || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/chat/admin/${selectedStudentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: trimmedReply,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send reply"
        );
      }

      if (data.chat) {
        setChatMessages((previousMessages) => [
          ...previousMessages,
          {
            ...data.chat,
            studentId: selectedStudentId,
            isRead: true,
          },
        ]);
      }

      setReply("");
    } catch (error) {
      console.error("Send admin reply error:", error.message);
      setError(error.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return "";
    }

    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // FORMAT CONVERSATION TIME
  // =========================================================

  const formatConversationTime = (date) => {
    if (!date) {
      return "";
    }

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return "";
    }

    const now = new Date();

    const sameDay =
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();

    if (sameDay) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  // =========================================================
  // STUDENT NAME
  // =========================================================

  const getStudentName = (student) => {
    if (!student) {
      return "Unknown Student";
    }

    return student.name || "Unknown Student";
  };

  // =========================================================
  // STUDENT EMAIL
  // =========================================================

  const getStudentEmail = (student) => {
    if (!student) {
      return "";
    }

    return student.email || "";
  };

  // =========================================================
  // AVATAR LETTER
  // =========================================================

  const getAvatarLetter = (student) => {
    const name = getStudentName(student);

    return name.charAt(0).toUpperCase();
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="admin-support-page">
        <div className="admin-support-loading">
          <div className="loading-spinner"></div>
          <p>Loading support chats...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="admin-support-page">
      <div className="support-glow support-glow-one"></div>
      <div className="support-glow support-glow-two"></div>

      {/* NAVBAR */}

      <nav className="admin-support-navbar">
        <div
          className="admin-support-brand"
          onClick={() => navigate("/admin")}
        >
          <div className="brand-icon">C</div>

          <div>
            <h2>COMPLAINO</h2>
            <span>Admin Support</span>
          </div>
        </div>

        <div className="admin-support-actions">
          <button
            className="back-dashboard-button"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

          <button
            className="admin-support-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}

      <main className="admin-support-container">
        <div className="admin-support-heading">
          <div>
            <p className="support-eyebrow">
              ADMIN COMMUNICATION
            </p>

            <h1>Support Chat</h1>

            <p>
              Communicate privately with students who need help.
            </p>
          </div>

          <div className="live-status">
            <span className="live-dot"></span>
            Auto-refreshing
          </div>
        </div>

        {error && (
          <div className="admin-support-error">
            {error}
          </div>
        )}

        {/* CHAT WORKSPACE */}

        <div className="admin-support-workspace">
          {/* LEFT */}

          <aside className="chat-sidebar">
            <div className="chat-sidebar-header">
              <div>
                <h3>Conversations</h3>

                <span>
                  {conversations.length}{" "}
                  {conversations.length === 1
                    ? "student"
                    : "students"}
                </span>
              </div>
            </div>

            <div className="student-conversation-list">
              {conversations.length === 0 ? (
                <div className="empty-conversations">
                  <div className="empty-chat-icon">
                    💬
                  </div>

                  <h4>No conversations yet</h4>

                  <p>
                    Student support messages will appear here.
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const isSelected =
                    selectedStudentId ===
                    conversation.studentId;

                  const studentName = getStudentName(
                    conversation.student
                  );

                  return (
                    <button
                      key={conversation.studentId}
                      className={`student-conversation ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleSelectStudent(
                          conversation.studentId
                        )
                      }
                    >
                      <div className="student-avatar">
                        {getAvatarLetter(
                          conversation.student
                        )}
                      </div>

                      <div className="conversation-info">
                        <div className="chat-name-row">
                          <strong>
                            {studentName}
                          </strong>

                          <small>
                            {formatConversationTime(
                              conversation.lastTime
                            )}
                          </small>
                        </div>

                        <div className="chat-preview-row">
                          <div className="chat-preview">
                            {conversation.lastMessage
                              ?.message || ""}
                          </div>

                          {conversation.unreadCount > 0 && (
                            <span className="unread-badge">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* RIGHT */}

          <section className="chat-main">
            {!selectedConversation ? (
              <div className="no-chat-selected">
                <div className="large-chat-icon">
                  💬
                </div>

                <h2>Select a conversation</h2>

                <p>
                  Choose a student from the left to view
                  their support conversation.
                </p>
              </div>
            ) : (
              <>
                {/* HEADER */}

                <div className="chat-main-header">
                  <div className="chat-header-student">
                    <div className="student-avatar large">
                      {getAvatarLetter(
                        selectedConversation.student
                      )}
                    </div>

                    <div>
                      <h3>
                        {getStudentName(
                          selectedConversation.student
                        )}
                      </h3>

                      <p>
                        {getStudentEmail(
                          selectedConversation.student
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="chat-header-status">
                    <span></span>
                    Support
                  </div>
                </div>

                {/* MESSAGES */}

                <div className="chat-messages">
                  {selectedConversation.messages.length ===
                  0 ? (
                    <div className="empty-chat">
                      <p>No messages yet.</p>
                    </div>
                  ) : (
                    selectedConversation.messages.map(
                      (message) => {
                        const isAdmin =
                          message.sender === "admin";

                        return (
                          <div
                            key={
                              message._id ||
                              message.id ||
                              `${message.createdAt}-${message.message}`
                            }
                            className={`message-row ${
                              isAdmin
                                ? "admin-message-row"
                                : "student-message-row"
                            }`}
                          >
                            <div
                              className={`message-bubble ${
                                isAdmin
                                  ? "admin-message"
                                  : "student-message"
                              }`}
                            >
                              <p>{message.message}</p>

                              <div className="message-time">
                                {formatTime(
                                  message.createdAt
                                )}

                                {isAdmin && (
                                  <span className="message-check">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>

                {/* INPUT */}

                <form
                  className="chat-input-area"
                  onSubmit={handleSendReply}
                >
                  <input
                    type="text"
                    value={reply}
                    onChange={(event) =>
                      setReply(event.target.value)
                    }
                    placeholder="Type a reply..."
                    maxLength={2000}
                    disabled={sending}
                  />

                  <button
                    type="submit"
                    disabled={
                      sending || !reply.trim()
                    }
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminSupport;
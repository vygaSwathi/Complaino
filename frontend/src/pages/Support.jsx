import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Support.css";

function Support() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [sending, setSending] = useState(false);

  /* ========================================
     FETCH ISSUES
  ======================================== */

  useEffect(() => {
    const fetchIssues = async () => {
      const token =
        sessionStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/issues/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Unable to load your issues"
          );
          return;
        }

        const userIssues =
          data.issues || [];

        setIssues(userIssues);

        if (userIssues.length > 0) {
          setSelectedIssue(userIssues[0]);
        }
      } catch (error) {
        console.error(
          "Fetch issues error:",
          error
        );

        setMessage(
          "Unable to connect to the server"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [navigate]);

  /* ========================================
     FETCH CHAT
  ======================================== */

  const fetchChat = async () => {
    const token =
      sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat/my",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load chat"
        );

        return;
      }

      const messages =
        Array.isArray(data.messages)
          ? data.messages
          : [];

      const formattedMessages =
        messages.map(
          (chat, index) => ({
            id:
              chat._id ||
              chat.id ||
              `${chat.createdAt}-${index}`,

            sender: chat.sender,

            name:
              chat.sender === "student"
                ? "You"
                : "Complaino Support",

            text:
              chat.message || "",

            time: chat.createdAt
              ? new Date(
                  chat.createdAt
                ).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "",
          })
        );

      setChatMessages(
        formattedMessages
      );
    } catch (error) {
      console.error(
        "Fetch chat error:",
        error
      );

      setMessage(
        "Unable to connect to chat server"
      );
    } finally {
      setChatLoading(false);
    }
  };

  /* ========================================
     INITIAL CHAT LOAD
  ======================================== */

  useEffect(() => {
    fetchChat();
  }, [navigate]);

  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout = async () => {
    try {
      await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    sessionStorage.removeItem(
      "accessToken"
    );

    navigate("/login");
  };

  /* ========================================
     SELECT ISSUE
  ======================================== */

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  /* ========================================
     SEND MESSAGE
  ======================================== */

  const sendMessage = async () => {
    const text =
      chatMessage.trim();

    if (!text) {
      return;
    }

    if (sending) {
      return;
    }

    const token =
      sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat/message",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to send message"
        );

        return;
      }

      /*
        IMPORTANT:

        We don't depend on data.chat here.

        The backend has already saved the
        message. We simply fetch the chat
        again so whatever response format
        the backend uses doesn't matter.
      */

      setChatMessage("");

      await fetchChat();

    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      setMessage(
        "Unable to connect to the server"
      );
    } finally {
      setSending(false);
    }
  };

  /* ========================================
     ENTER KEY
  ======================================== */

  const handleMessageKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* ========================================
     STATUS FORMATTER
  ======================================== */

  const formatStatus = (status) => {
    const statusMap = {
      pending_review: "IN REVIEW",
      open: "OPEN",
      in_progress: "IN PROGRESS",
      resolved: "RESOLVED",
      rejected: "REJECTED",
    };

    return (
      statusMap[status] ||
      status
        .replaceAll("_", " ")
        .toUpperCase()
    );
  };

  /* ========================================
     DATE FORMATTER
  ======================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="student-support-page">

      {/* BACKGROUND */}

      <div className="student-support-glow student-support-glow-pink"></div>

      <div className="student-support-glow student-support-glow-blue"></div>


      {/* NAVBAR */}

      <header className="student-support-navbar">

        <div className="student-support-brand">

          <div className="student-support-brand-mark">
            C
          </div>

          <div>
            <h2>COMPLAINO</h2>

            <span>
              Student Support
            </span>
          </div>

        </div>


        <div className="student-support-nav-actions">

          <button
            type="button"
            className="student-support-back"
            onClick={() =>
              navigate("/student")
            }
          >
            ← Dashboard
          </button>

          <button
            type="button"
            className="student-support-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="student-support-container">

        {/* HEADER */}

        <div className="student-support-header">

          <span className="student-support-eyebrow">
            COMPLAINO SUPPORT
          </span>

          <h1>
            How can we help?
          </h1>

          <p>
            Select one of your reported
            issues or start a conversation
            with Complaino support.
          </p>

        </div>


        {/* ERROR */}

        {message && (
          <div className="student-support-error">
            {message}
          </div>
        )}


        {/* WORKSPACE */}

        <section className="student-support-workspace">


          {/* LEFT SIDE */}

          <aside className="student-support-cases">

            <div className="student-support-cases-header">

              <div>

                <span>
                  YOUR CASES
                </span>

                <h2>
                  My Issues
                </h2>

              </div>

              <strong>
                {issues.length}
              </strong>

            </div>


            {loading && (
              <div className="student-support-info">
                Loading cases...
              </div>
            )}


            {!loading &&
              issues.length === 0 && (

                <div className="student-support-empty">

                  <div>
                    +
                  </div>

                  <p>
                    You don't have any
                    reported issues yet.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/student/report"
                      )
                    }
                  >
                    Report an Issue
                  </button>

                </div>

              )}


            <div className="student-support-case-list">

              {issues.map((issue) => (

                <button
                  type="button"
                  key={issue.requestCode}
                  className={`student-support-case ${
                    selectedIssue?.requestCode ===
                    issue.requestCode
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectIssue(issue)
                  }
                >

                  <div className="student-support-case-top">

                    <span>
                      {issue.category}
                    </span>

                    <small>
                      {formatDate(
                        issue.createdAt
                      )}
                    </small>

                  </div>


                  <strong>
                    {issue.title}
                  </strong>


                  <div className="student-support-case-bottom">

                    <code>
                      {issue.requestCode}
                    </code>

                    <span
                      className={`student-support-status student-support-status-${issue.status}`}
                    >
                      {formatStatus(
                        issue.status
                      )}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </aside>


          {/* RIGHT SIDE */}

          <section className="student-support-chat">


            {/* CHAT HEADER */}

            <header className="student-support-chat-header">

              <div>

                <span className="student-support-eyebrow">
                  LIVE SUPPORT
                </span>

                <h2>
                  {selectedIssue
                    ? selectedIssue.title
                    : "Support Chat"}
                </h2>

                <p>
                  {selectedIssue
                    ? selectedIssue.requestCode
                    : "GENERAL SUPPORT"}
                </p>

              </div>


              <div className="student-support-online">

                <span></span>

                Support online

              </div>

            </header>


            {/* CASE INFO */}

            {selectedIssue && (

              <div className="student-support-selected-case">

                <div>

                  <span>
                    CASE
                  </span>

                  <strong>
                    {selectedIssue.requestCode}
                  </strong>

                </div>


                <div>

                  <span>
                    STATUS
                  </span>

                  <strong>
                    {formatStatus(
                      selectedIssue.status
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    SUBMITTED
                  </span>

                  <strong>
                    {formatDate(
                      selectedIssue.createdAt
                    )}
                  </strong>

                </div>

              </div>

            )}


            {/* MESSAGES */}

            <div className="student-support-messages">

              {chatLoading ? (

                <div className="student-support-info">
                  Loading conversation...
                </div>

              ) : chatMessages.length === 0 ? (

                <div className="student-support-empty">

                  <div>
                    +
                  </div>

                  <p>
                    No messages yet.
                    Start a conversation
                    with Complaino support.
                  </p>

                </div>

              ) : (

                chatMessages.map((chat) => (

                  <div
                    key={chat.id}
                    className={`student-support-message ${
                      chat.sender === "student"
                        ? "student-support-message-user"
                        : "student-support-message-agent"
                    }`}
                  >

                    <div className="student-support-message-avatar">

                      {chat.sender === "student"
                        ? "Y"
                        : "C"}

                    </div>


                    <div className="student-support-message-body">

                      <div className="student-support-message-meta">

                        <strong>
                          {chat.name}
                        </strong>

                        <span>
                          {chat.time}
                        </span>

                      </div>


                      <div className="student-support-message-bubble">
                        {chat.text}
                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>


            {/* ==================================
                MESSAGE INPUT

                NO FORM NOW.

                BUTTON DIRECTLY CALLS sendMessage.
            ================================== */}

            <div className="student-support-input">

              <button
                type="button"
                className="student-support-attachment"
                title="Photo upload will be added next"
                onClick={() =>
                  alert(
                    "Photo upload will be added next."
                  )
                }
              >
                📎
              </button>


              <input
                type="text"
                value={chatMessage}
                placeholder="Write a message..."
                maxLength={2000}
                disabled={sending}
                onChange={(event) =>
                  setChatMessage(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleMessageKeyDown
                }
              />


              <button
                type="button"
                className="student-support-send"
                disabled={
                  sending ||
                  !chatMessage.trim()
                }
                onClick={sendMessage}
              >
                {sending
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default Support;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedIssue, setSelectedIssue] = useState(null);

  const [status, setStatus] = useState("");
  const [responseText, setResponseText] = useState("");

  const [updating, setUpdating] = useState(false);

  /* ========================================
     FETCH ISSUES
  ======================================== */

  const fetchIssues = async () => {
    const token =
      sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
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
            "Unable to load issues"
        );
        return;
      }

      setIssues(data.issues || []);
    } catch (error) {
      console.error(
        "Admin fetch error:",
        error
      );

      setMessage(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {
    fetchIssues();
  }, []);

  /* ========================================
     SELECT ISSUE
  ======================================== */

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);

    setStatus(issue.status);

    setResponseText(
      issue.response || ""
    );
  };

  /* ========================================
     UPDATE ISSUE
  ======================================== */

  const handleUpdateIssue = async () => {
    if (!selectedIssue) {
      return;
    }

    const token =
      sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${selectedIssue._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
            response: responseText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update issue"
        );

        return;
      }

      setMessage(
        "Issue updated successfully"
      );

      await fetchIssues();

      const updatedIssue = {
        ...selectedIssue,
        status,
        response: responseText,
      };

      setSelectedIssue(updatedIssue);
    } catch (error) {
      console.error(
        "Update issue error:",
        error
      );

      setMessage(
        "Unable to connect to the server"
      );
    } finally {
      setUpdating(false);
    }
  };

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
    } finally {
      sessionStorage.removeItem(
        "accessToken"
      );

      navigate("/login");
    }
  };

  /* ========================================
     STATUS FORMAT
  ======================================== */

  const formatStatus = (status) => {
    const statusMap = {
      pending_review: "Pending Review",
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      rejected: "Rejected",
    };

    return (
      statusMap[status] ||
      status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
    );
  };

  /* ========================================
     CATEGORY FORMAT
  ======================================== */

  const formatCategory = (category) => {
    return category
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* ========================================
     DATE FORMAT
  ======================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
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
    <div className="admin-page">

      <div className="admin-glow admin-glow-pink"></div>
      <div className="admin-glow admin-glow-blue"></div>

      {/* ==================================
          NAVBAR
      ================================== */}

      <header className="admin-navbar">

        <button
          className="admin-brand"
          onClick={() =>
            navigate("/admin")
          }
        >
          <div className="admin-brand-mark">
            C
          </div>

          <div>
            <h2>COMPLAINO</h2>
            <span>Administration</span>
          </div>
        </button>

        <div className="admin-nav-right">

          <div className="admin-role">
            <span>ROLE</span>

            <strong>
              Administrator
            </strong>
          </div>

          {/* SUPPORT CHAT BUTTON */}

          <button
            type="button"
            className="admin-chat-button"
            onClick={() =>
              navigate("/admin/support")
            }
          >
            💬 Support Chat
          </button>

          {/* LOGOUT */}

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ==================================
          MAIN
      ================================== */}

      <main className="admin-container">

        {/* HEADER */}

        <section className="admin-heading">

          <div>

            <span className="admin-eyebrow">
              ADMIN CONTROL CENTER
            </span>

            <h1>
              Campus Overview
            </h1>

            <p>
              Monitor campus reports,
              review submissions and manage
              student issues from one place.
            </p>

          </div>

        </section>

        {/* MESSAGE */}

        {message && (
          <div className="admin-message">

            {message}

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              style={{
                marginLeft: "15px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

          </div>
        )}

        {/* ==================================
            STATISTICS
        ================================== */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <span>
              Total Issues
            </span>

            <strong>
              {issues.length}
            </strong>

            <small>
              All submitted reports
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              Pending Review
            </span>

            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status ===
                    "pending_review"
                ).length
              }
            </strong>

            <small>
              Awaiting review
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              In Progress
            </span>

            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status ===
                    "in_progress"
                ).length
              }
            </strong>

            <small>
              Currently being handled
            </small>

          </div>

          <div className="admin-stat-card">

            <span>
              Resolved
            </span>

            <strong>
              {
                issues.filter(
                  (issue) =>
                    issue.status ===
                    "resolved"
                ).length
              }
            </strong>

            <small>
              Successfully completed
            </small>

          </div>

        </section>

        {/* ==================================
            ISSUES AREA
        ================================== */}

        <section className="admin-workspace">

          {/* ==================================
              ISSUE LIST
          ================================== */}

          <div className="admin-issues-panel">

            <div className="admin-panel-header">

              <div>

                <span className="admin-section-label">
                  CAMPUS REPORTS
                </span>

                <h2>
                  All Reported Issues
                </h2>

              </div>

              <span className="admin-count">
                {issues.length}
              </span>

            </div>

            {loading && (
              <div className="admin-loading">
                Loading issues...
              </div>
            )}

            {!loading &&
              issues.length === 0 && (

                <div className="admin-empty">

                  <h3>
                    No issues available
                  </h3>

                  <p>
                    No campus issues have
                    been reported yet.
                  </p>

                </div>
              )}

            {!loading &&
              issues.length > 0 && (

                <div className="admin-issue-list">

                  {issues.map((issue) => (

                    <button
                      key={issue._id}
                      className={`admin-issue-row ${
                        selectedIssue?._id ===
                        issue._id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectIssue(issue)
                      }
                    >

                      <div className="issue-row-main">

                        <div className="issue-row-top">

                          <span>
                            {formatCategory(
                              issue.category
                            )}
                          </span>

                          <span
                            className={`admin-status status-${issue.status}`}
                          >
                            {formatStatus(
                              issue.status
                            )}
                          </span>

                        </div>

                        <h3>
                          {issue.title}
                        </h3>

                        <p>
                          {issue.description}
                        </p>

                      </div>

                      <div className="issue-row-date">

                        <span>
                          {formatDate(
                            issue.createdAt
                          )}
                        </span>

                        <strong>
                          →
                        </strong>

                      </div>

                    </button>

                  ))}

                </div>
              )}

          </div>

          {/* ==================================
              ISSUE DETAILS
          ================================== */}

          <aside className="admin-details-panel">

            {!selectedIssue ? (

              <div className="admin-no-selection">

                <div className="admin-detail-icon">
                  +
                </div>

                <h3>
                  Select a report
                </h3>

                <p>
                  Select an issue from the
                  list to view its complete
                  details and manage it.
                </p>

              </div>

            ) : (

              <div className="admin-details">

                <div className="details-header">

                  <div>

                    <span className="admin-section-label">
                      ISSUE DETAILS
                    </span>

                    <h2>
                      {selectedIssue.title}
                    </h2>

                  </div>

                  <span
                    className={`admin-status status-${selectedIssue.status}`}
                  >
                    {formatStatus(
                      selectedIssue.status
                    )}
                  </span>

                </div>

                {/* WHAT HAPPENED */}

                <div className="detail-section">

                  <span>
                    WHAT HAPPENED
                  </span>

                  <p>
                    {selectedIssue.description}
                  </p>

                </div>

                {/* REQUEST CODE + CATEGORY */}

                <div className="detail-grid">

                  <div>

                    <span>
                      REQUEST CODE
                    </span>

                    <strong>
                      {selectedIssue.requestCode}
                    </strong>

                  </div>

                  <div>

                    <span>
                      CATEGORY
                    </span>

                    <strong>
                      {formatCategory(
                        selectedIssue.category
                      )}
                    </strong>

                  </div>

                </div>

                {/* STUDENT */}

                <div className="admin-student-box">

                  <span>
                    SUBMITTED BY
                  </span>

                  <h3>
                    {selectedIssue.studentId?.name ||
                      "Unknown student"}
                  </h3>

                  <p>
                    {selectedIssue.studentId?.email ||
                      "No email available"}
                  </p>

                </div>

                {/* DATES */}

                <div className="detail-grid">

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

                  <div>

                    <span>
                      LAST UPDATED
                    </span>

                    <strong>
                      {formatDate(
                        selectedIssue.updatedAt
                      )}
                    </strong>

                  </div>

                </div>

                {/* ADMIN RESPONSE */}

                <div className="detail-section">

                  <span>
                    ADMIN RESPONSE
                  </span>

                  <textarea
                    value={responseText}
                    onChange={(event) =>
                      setResponseText(
                        event.target.value
                      )
                    }
                    placeholder="Write a response to the student..."
                    maxLength={2000}
                  />

                </div>

                {/* UPDATE STATUS */}

                <div className="detail-section">

                  <span>
                    UPDATE STATUS
                  </span>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                  >

                    <option value="pending_review">
                      Pending Review
                    </option>

                    <option value="open">
                      Open
                    </option>

                    <option value="in_progress">
                      In Progress
                    </option>

                    <option value="resolved">
                      Resolved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                  </select>

                </div>

                {/* SAVE */}

                <button
                  className="admin-save-button"
                  onClick={
                    handleUpdateIssue
                  }
                  disabled={updating}
                >
                  {updating
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </aside>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
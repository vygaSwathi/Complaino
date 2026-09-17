import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CouncilDashboard.css";

function CouncilDashboard() {
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
        `${import.meta.env.VITE_API_URL}/api/issues`,
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
        "Fetch council issues error:",
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

    setMessage("");
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
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/issues/${selectedIssue._id}/status`,
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

      const updatedIssue = {
        ...selectedIssue,
        status: data.issue.status,
        response: data.issue.response,
        updatedAt: data.issue.updatedAt,
      };

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue._id === selectedIssue._id
            ? updatedIssue
            : issue
        )
      );

      setSelectedIssue(updatedIssue);

      setMessage(
        "Issue updated successfully"
      );

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
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
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
    <div className="council-page">

      <div className="council-glow council-glow-pink"></div>

      <div className="council-glow council-glow-blue"></div>

      {/* ==================================
          NAVBAR
      ================================== */}

      <header className="council-navbar">

        <button
          className="council-brand"
          onClick={() =>
            navigate("/council")
          }
        >

          <div className="council-brand-mark">
            C
          </div>

          <div>
            <h2>complaino</h2>
            <span>Council Portal</span>
          </div>

        </button>

        <div className="council-nav-right">

          <div className="council-role">

            <span>ROLE</span>

            <strong>
              Council Member
            </strong>

          </div>

          <button
            className="council-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ==================================
          MAIN
      ================================== */}

      <main className="council-container">

        {/* ==================================
            HEADER
        ================================== */}

        <section className="council-heading">

          <span className="council-eyebrow">
            COUNCIL DASHBOARD
          </span>

          <h1>
            Campus Issues
          </h1>

          <p>
            Review reported campus issues,
            track their progress and communicate
            updates to students.
          </p>

        </section>

        {/* ==================================
            MESSAGE
        ================================== */}

        {message && (
          <div className="council-message">
            {message}
          </div>
        )}

        {/* ==================================
            STATS
        ================================== */}

        <section className="council-stats">

          <div className="council-stat-card">

            <span>
              Total Issues
            </span>

            <strong>
              {issues.length}
            </strong>

            <small>
              Reports received
            </small>

          </div>

          <div className="council-stat-card">

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
              Need attention
            </small>

          </div>

          <div className="council-stat-card">

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

          <div className="council-stat-card">

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
              Completed reports
            </small>

          </div>

        </section>

        {/* ==================================
            WORKSPACE
        ================================== */}

        <section className="council-workspace">

          {/* ==================================
              ISSUE LIST
          ================================== */}

          <div className="council-issues-panel">

            <div className="council-panel-header">

              <div>

                <span className="council-section-label">
                  INCOMING REPORTS
                </span>

                <h2>
                  Campus Issues
                </h2>

              </div>

              <span className="council-count">
                {issues.length}
              </span>

            </div>

            {loading && (
              <div className="council-loading">
                Loading issues...
              </div>
            )}

            {!loading &&
              issues.length === 0 && (

                <div className="council-empty">

                  <h3>
                    No issues reported
                  </h3>

                  <p>
                    There are currently no
                    campus issues to review.
                  </p>

                </div>

              )}

            {!loading &&
              issues.length > 0 && (

                <div className="council-issue-list">

                  {issues.map((issue) => (

                    <button
                      key={issue._id}
                      className={`council-issue-row ${
                        selectedIssue?._id ===
                        issue._id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectIssue(issue)
                      }
                    >

                      <div className="council-issue-main">

                        <div className="council-issue-top">

                          <span>
                            {formatCategory(
                              issue.category
                            )}
                          </span>

                          <span
                            className={`council-status status-${issue.status}`}
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

                      <div className="council-issue-date">

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
              DETAILS PANEL
          ================================== */}

          <aside className="council-details-panel">

            {!selectedIssue ? (

              <div className="council-no-selection">

                <div className="council-detail-icon">
                  +
                </div>

                <h3>
                  Select a report
                </h3>

                <p>
                  Select an issue from the
                  list to view its details,
                  update its status and send
                  a response.
                </p>

              </div>

            ) : (

              <div className="council-details">

                {/* Details Header */}

                <div className="council-details-header">

                  <div>

                    <span className="council-section-label">
                      ISSUE DETAILS
                    </span>

                    <h2>
                      {selectedIssue.title}
                    </h2>

                  </div>

                  <span
                    className={`council-status status-${selectedIssue.status}`}
                  >
                    {formatStatus(
                      selectedIssue.status
                    )}
                  </span>

                </div>

                {/* What happened */}

                <div className="council-detail-section">

                  <span>
                    WHAT HAPPENED
                  </span>

                  <p>
                    {selectedIssue.description}
                  </p>

                </div>

                {/* Request Code + Category */}

                <div className="council-detail-grid">

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

                {/* Date information */}

                <div className="council-detail-grid">

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

                {/* Existing response */}

                <div className="council-existing-response">

                  <span>
                    CURRENT RESPONSE
                  </span>

                  {selectedIssue.response ? (

                    <p>
                      {selectedIssue.response}
                    </p>

                  ) : (

                    <p className="no-response">
                      No response has been
                      sent yet.
                    </p>

                  )}

                </div>

                {/* New response */}

                <div className="council-detail-section">

                  <span>
                    RESPONSE TO STUDENT
                  </span>

                  <textarea
                    value={responseText}
                    onChange={(event) =>
                      setResponseText(
                        event.target.value
                      )
                    }
                    placeholder="Write an update or response..."
                    maxLength={2000}
                  />

                </div>

                {/* Status */}

                <div className="council-detail-section">

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

                {/* Save */}

                <button
                  className="council-save-button"
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

export default CouncilDashboard;
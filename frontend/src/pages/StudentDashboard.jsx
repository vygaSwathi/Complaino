import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);

  // ========================================
  // FETCH STUDENT DATA
  // ========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [issuesResponse, profileResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/issues/my",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              "http://localhost:5000/api/auth/me",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        const issuesData =
          await issuesResponse.json();

        const profileData =
          await profileResponse.json();

        if (!issuesResponse.ok) {
          setMessage(
            issuesData.message ||
              "Unable to load your complaints"
          );
        } else {
          setIssues(
            issuesData.issues || []
          );
        }

        if (profileResponse.ok) {
          setUser(profileData.user);
        }

      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setMessage(
          "Unable to connect to the server"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);


  // ========================================
  // LOGOUT
  // ========================================

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


  // ========================================
  // STATUS
  // ========================================

  const formatStatus = (status) => {
    const statusMap = {
      pending_review: "In Review",
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


  // ========================================
  // DATE
  // ========================================

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


  // ========================================
  // PROFILE INITIAL
  // ========================================

  const getInitial = () => {
    if (!user?.name) {
      return "S";
    }

    return user.name
      .charAt(0)
      .toUpperCase();
  };


  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="student-page">

      {/* ========================================
          BACKGROUND
      ======================================== */}

      <div className="student-glow student-glow-pink"></div>

      <div className="student-glow student-glow-blue"></div>


      {/* ========================================
          NAVBAR
      ======================================== */}

      <header className="student-navbar">

        {/* BRAND */}

        <button
          className="student-brand"
          onClick={() =>
            navigate("/student")
          }
        >
          <div className="student-brand-mark">
            C
          </div>

          <div>
            <h2>
            COMPLAINO
            </h2>

            <span>
              Student Portal
            </span>
          </div>
        </button>


        {/* NAVIGATION */}

        <nav className="student-nav">

          <button
            className="active-nav"
            onClick={() =>
              navigate("/student")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/student/report")
            }
          >
            Complaints
          </button>

          <button
            onClick={() =>
              navigate("/student/support")
            }
          >
            Chat
          </button>

        </nav>


        {/* RIGHT SIDE */}

        <div className="student-navbar-right">

          {/* PROFILE */}

          <div className="student-profile-wrapper">

            <button
              className="student-profile-button"
              onClick={() =>
                setShowProfile(
                  (previous) =>
                    !previous
                )
              }
              aria-label="Open profile"
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M5 20C5.8 16.7 8.2 15 12 15C15.8 15 18.2 16.7 19 20"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

            </button>


            {/* PROFILE DROPDOWN */}

            {showProfile && (

              <div className="student-profile-menu">

                <div className="profile-menu-header">

                  <div className="profile-menu-avatar">
                    {getInitial()}
                  </div>

                  <div>
                    <strong>
                      {user?.name ||
                        "Student"}
                    </strong>

                    <span>
                      {user?.email ||
                        "Student account"}
                    </span>
                  </div>

                </div>


                <div className="profile-menu-divider"></div>


                <div className="profile-menu-details">

                  <div>
                    <span>
                      Account
                    </span>

                    <strong>
                      Student
                    </strong>
                  </div>


                  <div>
                    <span>
                      Member Since
                    </span>

                    <strong>
                      {formatDate(
                        user?.createdAt
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Complaints
                    </span>

                    <strong>
                      {issues.length}
                    </strong>
                  </div>

                </div>


                <button
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ========================================
          MAIN
      ======================================== */}

      <main className="student-container">


        {/* ========================================
            WELCOME
        ======================================== */}

        <section className="student-welcome">

          <div>

            <span className="student-eyebrow">
              STUDENT PORTAL
            </span>

            <h1>
              Welcome back
              {user?.name
                ? `, ${user.name.split(" ")[0]}`
                : ""}
              .
            </h1>

            <p>
              Keep track of your campus
              complaints and stay connected
              with campus support.
            </p>

          </div>


          <button
            className="student-report-button"
            onClick={() =>
              navigate("/student/report")
            }
          >
            <span>+</span>
            Report an Issue
          </button>

        </section>


        {/* ========================================
            COMPLAINTS
        ======================================== */}

        <section className="student-card complaints-card">

          <div className="card-header">

            <div>

              <span className="section-eyebrow">
                YOUR COMPLAINTS
              </span>

              <h2>
                Complaint History
              </h2>

            </div>


            <span className="issue-total">
              {issues.length}{" "}
              {issues.length === 1
                ? "complaint"
                : "complaints"}
            </span>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="student-loading">
              Loading your complaints...
            </div>

          )}


          {/* ERROR */}

          {!loading && message && (

            <div className="student-error">
              {message}
            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !message &&
            issues.length === 0 && (

              <div className="student-empty">

                <div className="empty-icon">
                  +
                </div>

                <h3>
                  No complaints yet
                </h3>

                <p>
                  If something on campus
                  needs attention, you can
                  report it here.
                </p>

                <button
                  className="student-primary-button"
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


          {/* COMPLAINT LIST */}

          {!loading &&
            !message &&
            issues.length > 0 && (

              <div className="complaint-list">

                {issues.map((issue) => (

                  <article
                    className="complaint-item"
                    key={issue.requestCode}
                  >

                    <div className="complaint-main">

                      <div className="complaint-top">

                        <span className="request-code">
                          {issue.requestCode}
                        </span>

                        <span
                          className={`status-pill status-${issue.status}`}
                        >
                          <span></span>

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


                      <div className="complaint-meta">

                        <span>
                          {issue.category}
                        </span>

                        <span>
                          Submitted{" "}
                          {formatDate(
                            issue.createdAt
                          )}
                        </span>

                      </div>

                    </div>


                    {/* RESPONSE */}

                    <div className="complaint-response">

                      <span className="response-label">
                        RESPONSE
                      </span>


                      {issue.response ? (

                        <p>
                          {issue.response}
                        </p>

                      ) : (

                        <p className="no-response">
                          No response yet. Your
                          complaint is being reviewed.
                        </p>

                      )}

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>


        {/* ========================================
            INFORMATION + CHAT
        ======================================== */}

        <section className="student-feature-grid">


          {/* ABOUT / FACTS */}

          <div className="student-card facts-card">

            <span className="section-eyebrow">
            COMPLAINO
            </span>

            <h2>
              Your campus,
              <br />
              your voice.
            </h2>

            <p>
              complaino gives students
              a simple way to report problems,
              follow their progress, and
              communicate with campus support.
            </p>


            <div className="facts-list">

              <div>
                <strong>
                  Private
                </strong>

                <span>
                  Your complaints are visible
                  only to you and authorized
                  campus members.
                </span>
              </div>


              <div>
                <strong>
                  Transparent
                </strong>

                <span>
                  Follow the progress of the
                  complaints you submit.
                </span>
              </div>


              <div>
                <strong>
                  Connected
                </strong>

                <span>
                  Get support when you need it.
                </span>
              </div>

            </div>

          </div>


          {/* CHAT */}

          <div className="student-card chat-card">

            <div className="chat-card-content">

              <span className="section-eyebrow">
                CAMPUS SUPPORT
              </span>

              <h2>
                Need to talk?
              </h2>

              <p>
                Have a question about your
                complaint or need help with
                something else? Start a
                conversation with campus
                support.
              </p>

            </div>


            <button
              className="chat-button"
              onClick={() =>
                navigate(
                  "/student/support"
                )
              }
            >
              Open Chat

              <span>
                →
              </span>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;
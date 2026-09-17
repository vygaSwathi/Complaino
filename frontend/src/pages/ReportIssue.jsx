import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ReportIssue.css";

function ReportIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("infrastructure");

  const [message, setMessage] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setRequestCode("");
    setLoading(true);

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to submit issue"
        );
        return;
      }

      setRequestCode(data.issue.requestCode);

      setMessage("Issue submitted successfully!");

      setTitle("");
      setDescription("");
      setCategory("infrastructure");
    } catch (error) {
      console.error("Submit issue error:", error);

      setMessage(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page-wrapper">

      {/* Background glow */}
      <div className="report-glow report-glow-pink"></div>
      <div className="report-glow report-glow-blue"></div>

      {/* Navbar */}
      <header className="report-navbar">

        <button
          className="report-brand"
          onClick={() => navigate("/student")}
        >
          <div className="report-brand-mark">
            C
          </div>

          <div>
            <h2>Complaino</h2>
            <span>Student Portal</span>
          </div>
        </button>

        <nav className="report-nav">

          <button
            onClick={() => navigate("/student")}
          >
            Dashboard
          </button>

          <button className="active-report-nav">
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

        <button
          className="report-profile-button"
          onClick={() => navigate("/student")}
          aria-label="Go to dashboard"
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

      </header>

      {/* Main content */}
      <main className="report-container">

        <section className="report-heading">

          <span className="report-eyebrow">
          COMPLAINO
          </span>

          <h1>Report an Issue</h1>

          <p>
            Tell us what is happening on campus.
            Your report will be reviewed by the
            appropriate team.
          </p>

        </section>

        <section className="report-card">

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="report-form-group">

              <label htmlFor="title">
                Issue Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="e.g. Broken classroom fan"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                minLength={5}
                maxLength={150}
                required
              />

            </div>

            {/* Description */}
            <div className="report-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                minLength={10}
                maxLength={2000}
                rows={6}
                required
              />

            </div>

            {/* Category */}
            <div className="report-form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="academics">
                  Academics
                </option>

                <option value="infrastructure">
                  Infrastructure
                </option>

                <option value="hostel">
                  Hostel
                </option>

                <option value="transport">
                  Transport
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="cleanliness">
                  Cleanliness
                </option>

                <option value="other">
                  Other
                </option>
              </select>

            </div>

            <button
              type="submit"
              className="report-submit-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Issue"}
            </button>

          </form>

          {/* Result */}
          {message && (
            <div
              className={`report-result ${
                requestCode
                  ? "report-success"
                  : "report-error"
              }`}
            >

              <p>{message}</p>

              {requestCode && (
                <>
                  <span className="request-code-label">
                    YOUR REQUEST CODE
                  </span>

                  <strong className="request-code">
                    {requestCode}
                  </strong>

                  <p className="request-code-info">
                    Save this code for future
                    reference.
                  </p>

                  <button
                    type="button"
                    className="view-issues-button"
                    onClick={() =>
                      navigate("/student")
                    }
                  >
                    View My Issues →
                  </button>
                </>
              )}

            </div>
          )}

        </section>

        <button
          className="report-back-button"
          onClick={() => navigate("/student")}
        >
          ← Back to Dashboard
        </button>

      </main>

    </div>
  );
}

export default ReportIssue;
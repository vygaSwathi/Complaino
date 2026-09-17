import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const API_URL = "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");
    setResetToken("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists with this email, a reset link will be sent."
      );

      // Development only.
      // The backend currently returns the token because
      // email sending has not been connected yet.
      if (data.developmentResetToken) {
        setResetToken(data.developmentResetToken);
      }
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="brand">
          <div className="brand-mark">C</div>

          <div>
            <h1>COMPLAINO</h1>
            <p>Student Support System</p>
          </div>
        </div>

        <div className="forgot-content">
          <div className="icon-circle">🔐</div>

          <h2>Forgot Password?</h2>

          <p className="description">
            Enter the email address associated with your
            COMPLAINO account and we'll help you reset your
            password.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {resetToken && (
              <div className="development-box">
                <strong>Development Mode</strong>

                <p>
                  Email sending is not connected yet.
                  Your temporary reset token is shown below
                  so we can test the reset flow.
                </p>

                <div className="token-box">
                  {resetToken}
                </div>

                <Link
                  to={`/reset-password?token=${encodeURIComponent(
                    resetToken
                  )}`}
                  className="reset-link"
                >
                  Continue to Reset Password →
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Instructions"}
            </button>
          </form>

          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
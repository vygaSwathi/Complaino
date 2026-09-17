import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const API_URL = "http://localhost:5000";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "This password reset link is invalid or missing."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Password reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      // Give the user time to see the success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">

        {/* BRAND */}
        <div className="reset-brand">
          <div className="reset-brand-mark">
            C
          </div>

          <div>
            <h1>COMPLAINO</h1>
            <p>Student Support System</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="reset-content">

          <div className="reset-icon">
            🔑
          </div>

          <h2>Reset Password</h2>

          <p className="reset-description">
            Create a new password for your COMPLAINO
            account.
          </p>

          {!token ? (
            <div className="invalid-reset">
              <div className="invalid-icon">
                ⚠️
              </div>

              <h3>Invalid Reset Link</h3>

              <p>
                This password reset link is missing or
                invalid. Please request a new password
                reset link.
              </p>

              <Link
                to="/forgot-password"
                className="request-reset-button"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* NEW PASSWORD */}
              <div className="field">
                <label htmlFor="password">
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                />

                <span className="field-hint">
                  Minimum 8 characters
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="field">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="reset-error">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="reset-success">
                  {success}

                  <span>
                    Redirecting you to login...
                  </span>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || !!success}
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="reset-back-link"
          >
            ← Back to Login
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      console.log("Login successful:", data);

      // Save access token temporarily
      sessionStorage.setItem("accessToken", data.accessToken);

      // Send user to the correct dashboard
      if (data.user.role === "student") {
        navigate("/student");
      } else if (data.user.role === "council") {
        navigate("/council");
      } else if (data.user.role === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background gradient effects */}
      <div className="login-glow login-glow-pink"></div>
      <div className="login-glow login-glow-blue"></div>

      <div className="login-content">
        {/* ========================================
            BRAND
        ======================================== */}

        <div className="login-brand">
          <div className="login-logo">C</div>

          <div>
            <h1>COMPLAINO</h1>
            <p>Your campus. Your voice.</p>
          </div>
        </div>

        {/* ========================================
            LOGIN GLASS CARD
        ======================================== */}

        <div className="login-card">
          {/* Heading */}

          <div className="login-header">
            <span>WELCOME BACK</span>

            <h2>Sign in</h2>

            <p>
              Enter your credentials to access
              your campus dashboard.
            </p>
          </div>

          {/* ========================================
              LOGIN FORM
          ======================================== */}

          <form
            onSubmit={handleLogin}
            className="login-form"
          >
            {/* ========================================
                EMAIL
            ======================================== */}

            <div className="login-field">
              <label htmlFor="email">
                Email
              </label>

              <div className="login-input">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* ========================================
                PASSWORD
            ======================================== */}

            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="login-input">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                {/* Password visibility toggle */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    /* Eye off */
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.9 4.3C10.57 4.1 11.27 4 12 4C18.5 4 22 12 22 12C21.46 13.42 20.55 14.78 19.4 15.9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M6.1 6.1C3.9 7.55 2.55 9.6 2 12C2 12 5.5 20 12 20C13.4 20 14.7 19.7 15.9 19.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ========================================
                LOGIN BUTTON
            ======================================== */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          {/* ========================================
              ERROR / STATUS MESSAGE
          ======================================== */}

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          {/* ========================================
              DIVIDER
          ======================================== */}

          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* ========================================
              REGISTER
          ======================================== */}

          <div className="login-register">
            <span>New to COMPLAINO?</span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>
          </div>
        </div>

        {/* ========================================
            BACK TO HOME
        ======================================== */}

        <button
          type="button"
          className="login-home"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}

export default Login;
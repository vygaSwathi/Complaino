import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // REGISTER
  // ========================================

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Registration failed"
        );
        return;
      }

      console.log(
        "Registration successful:",
        data
      );

      // Store access token
      sessionStorage.setItem(
        "accessToken",
        data.accessToken
      );

      // Automatically enter student dashboard
      navigate("/student");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setMessage(
        "Unable to connect to the server"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Background glows */}

      <div className="register-glow register-glow-pink"></div>

      <div className="register-glow register-glow-blue"></div>

      <div className="register-content">

        {/* ========================================
            BRAND
        ======================================== */}

        <div className="register-brand">

          <div className="register-logo">
            C
          </div>

          <div>
            <h1>
              COMPLAINO
            </h1>

            <p>
              Your campus. Your voice.
            </p>
          </div>

        </div>

        {/* ========================================
            REGISTER CARD
        ======================================== */}

        <div className="register-card">

          {/* Header */}

          <div className="register-header">

            <span>
              GET STARTED
            </span>

            <h2>
              Create account
            </h2>

            <p>
              Create your student account
              and connect with your campus.
            </p>

          </div>

          {/* ========================================
              FORM
          ======================================== */}

          <form
            onSubmit={handleRegister}
            className="register-form"
          >

            {/* ========================================
                FULL NAME
            ======================================== */}

            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input">

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* ========================================
                EMAIL
            ======================================== */}

            <div className="register-field">

              <label htmlFor="email">
                Email
              </label>

              <div className="register-input">

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

            </div>

            {/* ========================================
                PASSWORD
            ======================================== */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  minLength={8}
                  required
                />

                {/* Password visibility toggle */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
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
                SUBMIT
            ======================================== */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          {/* ========================================
              MESSAGE
          ======================================== */}

          {message && (
            <div className="register-message">
              {message}
            </div>
          )}

          {/* ========================================
              DIVIDER
          ======================================== */}

          <div className="register-divider">

            <span>
              OR
            </span>

          </div>

          {/* ========================================
              LOGIN
          ======================================== */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>

          </div>

        </div>

        {/* ========================================
            BACK HOME
        ======================================== */}

        <button
          type="button"
          className="register-home"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to home
        </button>

      </div>

    </div>
  );
}

export default Register;
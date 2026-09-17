import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Background glow */}
      <div className="home-glow home-glow-pink"></div>
      <div className="home-glow home-glow-blue"></div>

      {/* Navbar */}
      <header className="home-navbar">

        <div className="home-logo">

          <div className="home-logo-mark">
            C
          </div>

          <div>
            <h2>COMPLAINO</h2>
            <span>Your campus. Your voice.</span>
          </div>

        </div>

        <div className="home-nav-actions">

          <button
            className="home-login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="home-register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </header>

      {/* Hero Section */}
      <main className="home-hero">

        <div className="home-hero-content">

          <div className="home-eyebrow">
          COMPLAINO
          </div>

          <h1>
            Make your campus
            <span> better.</span>
          </h1>

          <p>
            Report campus issues, track their progress,
            and help create a better environment for everyone.
          </p>

          <div className="home-hero-actions">

            <button
              className="home-primary-button"
              onClick={() => navigate("/register")}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="home-secondary-button"
              onClick={() => navigate("/login")}
            >
              I already have an account
            </button>

          </div>

        </div>

        {/* Decorative Glass Card */}
        <div className="home-visual">

          <div className="home-glass-card">

            <div className="glass-card-header">

              <span className="glass-dot"></span>
              <span className="glass-dot"></span>
              <span className="glass-dot"></span>

            </div>

            <div className="glass-card-content">

              <span className="glass-label">
                CAMPUS STATUS
              </span>

              <h3>
                Your voice
                <br />
                matters.
              </h3>

              <div className="glass-status">

                <span></span>

                Issues are being tracked

              </div>

            </div>

          </div>

          {/* Floating Card */}
          <div className="home-floating-card">

            <span>✓</span>

            <div>
              <strong>Track your issues</strong>
              <small>Stay updated on progress</small>
            </div>

          </div>

        </div>

      </main>

      {/* Bottom Text */}
      <div className="home-bottom">

        <span>REPORT</span>
        <span>•</span>
        <span>TRACK</span>
        <span>•</span>
        <span>RESOLVE</span>

      </div>

    </div>
  );
}

export default Home;
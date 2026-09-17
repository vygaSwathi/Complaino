import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Decode the JWT payload.
  // This is only for frontend routing.
  // The backend remains the real security boundary.
  let userRole = null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    userRole = payload.role;
  } catch (error) {
    console.error("Invalid token:", error);
    sessionStorage.removeItem("accessToken");

    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    if (userRole === "student") {
      return <Navigate to="/student" replace />;
    }

    if (userRole === "council") {
      return <Navigate to="/council" replace />;
    }

    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
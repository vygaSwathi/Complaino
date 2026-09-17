import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import ReportIssue from "./pages/ReportIssue";
import Support from "./pages/Support";

import CouncilDashboard from "./pages/CouncilDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminSupport from "./pages/AdminSupport";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================================
            STUDENT ROUTES
        ========================================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/report"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/support"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Support />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            COUNCIL ROUTE
        ========================================= */}

        <Route
          path="/council"
          element={
            <ProtectedRoute allowedRoles={["council"]}>
              <CouncilDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            ADMIN DASHBOARD
        ========================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            ADMIN SUPPORT CHAT
        ========================================= */}

        <Route
          path="/admin/support"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSupport />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            FALLBACK
        ========================================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
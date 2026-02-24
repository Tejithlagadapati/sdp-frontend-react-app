import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";

import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";

import ProtectedRoute from "../components/common/ProtectedRoute";

import TrendingPage from "../components/trending/TrendingPage";
import TrendingDetails from "../components/trending/TrendingDetails";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* User Home */}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="home" />
          </ProtectedRoute>
        }
      />

      {/* User Pages */}
      <Route
        path="/user/services"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="services" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/issues"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="issues" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/report"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="report" />
          </ProtectedRoute>
        }
      />

      {/* Trending (Public) */}
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/trending/:id" element={<TrendingDetails />} />
      <Route
        path="/user/feedback"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="feedback" />
          </ProtectedRoute>
        }
      />

      {/* Fallback (ALWAYS LAST) */}
      <Route path="*" element={<Navigate to="/" />} />
      <Route
        path="/user/notifications"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="notifications" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
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
            <AdminPage page="overview" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/public-services"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage page="public-services" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/infrastructure"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage page="infrastructure" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/amenities"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage page="amenities" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/issue-reports"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage page="issue-reports" />
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

      <Route
        path="/user/trending"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="trending" />
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
      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="bookings" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/notifications"
        element={
          <ProtectedRoute role="USER">
            <UserPage page="notifications" />
          </ProtectedRoute>
        }
      />
      {/* Fallback (ALWAYS LAST) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getRole } from "../../services/authUtils";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  const currentRole = user?.role || getRole();

  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

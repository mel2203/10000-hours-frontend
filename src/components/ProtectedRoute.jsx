import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//if the user is not logged in, redirect to login page. Otherwise, render the children
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

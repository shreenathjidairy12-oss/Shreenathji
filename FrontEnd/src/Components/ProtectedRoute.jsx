import { Navigate } from "react-router-dom";

// Protected Route Component - checks if user is authenticated
export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If role is required and doesn't match, redirect to login
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated and authorized
    return children;
}

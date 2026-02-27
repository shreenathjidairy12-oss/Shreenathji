import { useNavigate } from "react-router-dom";
import "./Logout.css";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        // Redirect to login with replace (prevents back button)
        navigate("/login", { replace: true });
    };

    return (
        <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
        </button>
    );
}

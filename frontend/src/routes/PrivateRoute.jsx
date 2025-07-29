import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRole, children }) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) return <Navigate to="/" replace />;
    if (role !== allowedRole) return <Navigate to="/" replace />;

    return children;
};

export default PrivateRoute;

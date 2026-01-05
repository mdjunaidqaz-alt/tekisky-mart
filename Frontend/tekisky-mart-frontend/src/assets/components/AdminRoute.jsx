import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";


const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;

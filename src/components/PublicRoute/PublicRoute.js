import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  if (auth) {
    return <Navigate to="/inbox" />;
  } else {
    return children;
  }
};

export default PublicRoute;

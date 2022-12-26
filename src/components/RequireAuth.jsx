import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "../contexts/authContext";

const RequireAuth = ({ children, redirectTo = "/login" }) => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  return currentUser() ? children : navigate(redirectTo);
};

export default RequireAuth;

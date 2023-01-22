import { onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "@solidjs/router";

function Login() {
  const { logout } = useAuthContext();

  const navigate = useNavigate();

  onMount(async () => {
    const logoutUser = async () => {
      await logout();
      navigate("/");
    };
    logoutUser();
  });

  return <h1>Logout</h1>;
}

export default Login;

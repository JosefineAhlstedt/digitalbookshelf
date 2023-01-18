import { A } from "@solidjs/router";
import styles from "./Login.module.scss";
import { createSignal } from "solid-js";
import { useFirebaseApp } from "solid-firebase";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "@solidjs/router";

function Login() {
  const { login, test } = useAuthContext();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const app = useFirebaseApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      login(email(), password())
        .then((userCredential) => {
          const user = userCredential.user;
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class={styles.container}>
      <div class={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="text"
              placeholder="username"
              onInput={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="text"
              placeholder="********"
              onInput={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button class={styles.signinButton} type="submit">
              Sign in
            </button>
            <A href="/register">Registrera dig!</A>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

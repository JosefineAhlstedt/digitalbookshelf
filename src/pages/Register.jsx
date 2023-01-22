import { A } from "@solidjs/router";
import styles from "./Login.module.scss";
import { createSignal } from "solid-js";
import { useFirebaseApp } from "solid-firebase";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "@solidjs/router";

function Login() {
  const { signup } = useAuthContext();
  const [email, setEmail] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [photo, setPhoto] = createSignal("");
  //const app = useFirebaseApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      signup(email(), username(), password(), photo())
        .then(() => {
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
            <label>Username</label>
            <input
              type="text"
              placeholder="name"
              onInput={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="********"
              onInput={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="file">Photo</label>
            <input type="file" onInput={(e) => setPhoto(e.target.files[0])} />
          </div>
          <div>
            <button class={styles.signinButton} type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

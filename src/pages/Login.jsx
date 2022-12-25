import { Routes, Route, A } from "@solidjs/router"
import styles from "./Login.module.scss"

function Login() {
  return (
    <div class={styles.container}>
      <form>
        <label htmlFor="">Email</label>
        <input type="text" placeholder="username" />
        <label htmlFor="">Password</label>
        <input type="text" placeholder="********" />
        <div>
          <button>Sign in</button>
          <A href="">Glömt lösenord?</A>
        </div>
      </form>
    </div>
  )
}

export default Login

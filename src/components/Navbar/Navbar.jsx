import { Routes, Route, A } from "@solidjs/router";
import styles from "./Navbar.module.scss";
import { createSignal, Show } from "solid-js";

function Navbar() {
  const [active, setActive] = createSignal("inactive");
  return (
    <header>
      <div class={active()}>
        <div class={styles.container}>
          <nav class={styles.nav}>
            <A href="/mybooks">My books</A>
            <A href="/">Home</A>
            <A href="/login">Login</A>
            <A href="/logout">Logout</A>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

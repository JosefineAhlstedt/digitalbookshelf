import { A } from "@solidjs/router";
import styles from "./Navbar.module.scss";
import { createSignal, Show } from "solid-js";
import { useAuthContext } from "../../contexts/authContext";
import Searchbar from "../Searchbar/Searchbar";

function Navbar() {
  const [active, setActive] = createSignal("inactive");
  const { currentUser } = useAuthContext();
  return (
    <header>
      <div class={active()}>
        <div class={styles.container}>
          <nav class={styles.nav}>
            <Show when={currentUser()}>
              <A href="/mybooks">My books</A>
            </Show>
            <Show when={currentUser()}>
              <A href="/profile">Profile</A>
            </Show>
            <A href="/">Home</A>
            <Show when={!currentUser()}>
              <A href="/login">Login</A>
            </Show>
            <Show when={currentUser()}>
              <A href="/logout">Logout</A>
            </Show>
            <Searchbar></Searchbar>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

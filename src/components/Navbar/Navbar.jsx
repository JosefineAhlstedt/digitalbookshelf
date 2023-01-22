import { A } from "@solidjs/router";
import styles from "./Navbar.module.scss";
import { createEffect, createSignal, Show } from "solid-js";
import { useAuthContext } from "../../contexts/authContext";
import Searchbar from "../Searchbar/Searchbar";
import { useParams } from "@solidjs/router";

function Navbar() {
  const [active, setActive] = createSignal("inactive");
  const [show, setShow] = createSignal(false);
  const { currentUser } = useAuthContext();

  return (
    <header>
      <Show when={show()}>
        <div class={styles.popout}>
          <button
            class={styles.closeButton}
            onClick={() => {
              setShow(false);
            }}
          >
            CLOSE
          </button>
          <A
            onClick={() => {
              setShow(false);
            }}
            href="/"
          >
            Home
          </A>
          <Show when={currentUser()}>
            <A
              onClick={() => {
                setShow(false);
              }}
              href="/mybooks"
            >
              My books
            </A>
          </Show>
          <Show when={currentUser()}>
            <A
              onClick={() => {
                setShow(false);
              }}
              href={`/profile/${currentUser().uid}`}
            >
              Profile
            </A>
          </Show>
          <Show when={currentUser()}>
            <A
              onClick={() => {
                setShow(false);
              }}
              id={styles.logout}
              href="/logout"
            >
              Logout
            </A>
          </Show>
        </div>
      </Show>
      <div class={active()}>
        <div class={styles.container}>
          <nav class={styles.nav}>
            <A href="/">Home</A>
            <Show when={currentUser()}>
              <A href="/mybooks">My books</A>
            </Show>
            <Show when={currentUser()}>
              <A href={`/profile/${currentUser().uid}`}>Profile</A>
            </Show>

            <Show when={!currentUser()}>
              <A href="/login">Login</A>
            </Show>
            <Searchbar></Searchbar>
            <Show when={currentUser()}>
              <A href="/logout">Logout</A>
            </Show>
          </nav>
          <nav class={styles.navPhone}>
            {/* <Show when={show()}>
              <div class={styles.popout}></div>
            </Show> */}
            <Searchbar></Searchbar>
            <button
              class={styles.menu}
              onClick={() => {
                setShow(true);
              }}
            >
              MENU
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

import { Routes, Route, A, Navigate } from "@solidjs/router";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import getUser from "../hooks/useGetUser";
import styles from "./Profile.module.scss";
import { useNavigate } from "@solidjs/router";

function Profile() {
  const [bookUser, setBookUser] = createSignal();
  //   i(() => {
  //     const { currentUser } = useAuthContext();
  //     if (currentUser().uid !== undefined) {
  //       console.log("Hi user!");
  //     }
  //   });

  createEffect(() => {
    const user = getUser().then(function (data) {
      console.log("User!", data);
      setBookUser(data);
    });
  });

  createEffect(() => {
    console.log("Got the data woop woop I love this", bookUser());
  });

  return (
    <div>
      {bookUser() && (
        <>
          <h1>{bookUser().username}</h1>
          <img class={styles.profilePhoto} src={`${bookUser().photoURL}`}></img>
        </>
      )}
    </div>
  );
}

export default Profile;

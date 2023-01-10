import { Routes, Route, A, useParams } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import styles from "./MyBooks.module.scss";

function Bookshelf() {
  const [books, setBooks] = createSignal();
  const params = useParams();

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      console.log("user", currentUser().uid);
      console.log("id", params.name);
      //Get the bookshelves that the user has
      return getBooks(currentUser().uid, params.name).then(function (data) {
        console.log("Data", data);
      });
    }
  });

  // createEffect(() => {
  //   if (books() !== undefined) {
  //     console.log("BOOKS", books());
  //   }
  // });

  return (
    <div>
      <h1>{params.name}</h1>
    </div>
  );
}

export default Bookshelf;

import { Routes, Route, A, Navigate } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import styles from "./MyBooks.module.scss";
import { useNavigate } from "@solidjs/router";

function MyBooks() {
  const [books, setBooks] = createSignal();
  const navigate = useNavigate();

  function sort(shelves, userId) {
    Promise.all(shelves.map((shelf) => getBooks(userId, shelf))).then(
      (results) => {
        setBooks(results);
        console.log(results);
        return results;
      }
    );
  }

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      return getBookshelves(currentUser().uid).then(function (data) {
        console.log("data", data);
        sort(data, currentUser().uid);
      });
    }
  });

  createEffect(() => {
    if (books() !== undefined) {
      console.log("BOOKS", books());
    }
  });

  return (
    <div>
      <h1>These are my bookshelves:</h1>
      {books() &&
        books().map((library) => {
          return (
            <div
              onClick={() => navigate(`/bookshelf/${library.shelf.id}`)}
              class={styles.card}
            >
              <h2>{`${library.shelf.name} (${library.books.length})`}</h2>
            </div>
          );
        })}
      <button>Create new bookshelf</button>
    </div>
  );
}

export default MyBooks;

import { Routes, Route, A, Navigate } from "@solidjs/router";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import styles from "./MyBooks.module.scss";
import { useNavigate } from "@solidjs/router";

function MyBooks() {
  const [books, setBooks] = createSignal();
  const [bookshelves, setBookshelves] = createSignal();
  const [library, setLibrary] = createSignal();
  const navigate = useNavigate();

  function sort(shelves, books) {
    const myLibrary = [];
    if (shelves && books !== undefined) {
      shelves.forEach((shelf) => {
        let arrayBooks = [];
        const shelfWithBooks = {
          books: arrayBooks,
          shelf: { ...shelf },
        };
        books.books.forEach((book) => {
          if (book.bookshelfId === shelf.id) {
            arrayBooks.push(book);
          }
        });

        myLibrary.push(shelfWithBooks);
      });
      console.log("Library", myLibrary);

      return myLibrary;
    }
  }

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      getBooks(currentUser().uid).then(function (data) {
        setBooks(data);
      });
      getBookshelves(currentUser().uid).then(function (data) {
        setBookshelves(data);
      });
    }
  });

  createEffect(() => {
    setLibrary(sort(bookshelves(), books()));
  });

  return (
    <div>
      <h1>These are my bookshelves:</h1>
      {library() &&
        library().map((library) => {
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

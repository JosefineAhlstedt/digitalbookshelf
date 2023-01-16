import { Routes, Route, A, Navigate } from "@solidjs/router";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import addBookshelf from "../hooks/useAddBookshelf";
import styles from "./MyBooks.module.scss";
import { useNavigate } from "@solidjs/router";

function MyBooks() {
  const [books, setBooks] = createSignal();
  const [bookshelves, setBookshelves] = createSignal();
  const [library, setLibrary] = createSignal();
  const [showForm, setShowForm] = createSignal(false);
  const [name, setName] = createSignal("");
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  function sort(shelves, books) {
    const myLibrary = [];
    if (shelves && books !== undefined) {
      shelves.forEach((shelf) => {
        let arrayBooks = [];
        const shelfWithBooks = {
          books: arrayBooks,
          shelf: { ...shelf },
        };
        books.forEach((book) => {
          if (book.book.bookshelfId === shelf.id) {
            arrayBooks.push(book);
          }
        });

        myLibrary.push(shelfWithBooks);
      });
      console.log("Library", myLibrary);

      return myLibrary;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log("params", e);
      addBookshelf(name(), currentUser().uid).then(function (data) {
        console.log("added data!");
        setShowForm(false);
        //navigate(`/bookshelf/${data.id}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  createEffect(() => {
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
    <div class={showForm() ? styles.fade : styles.container}>
      <h1>These are my bookshelves:</h1>
      <Show when={showForm()}>
        <div class={styles.form}>
          <form onSubmit={handleSubmit}>
            <button
              class={styles.closeButton}
              onClick={() => {
                setShowForm(false);
              }}
            >
              ✕
            </button>
            <input
              type="text"
              placeholder="name"
              onInput={(e) => setName(e.target.value)}
            />
            <button class={styles.createButton} type="submit">
              Create
            </button>
          </form>
        </div>
      </Show>
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
      <button
        onClick={() => {
          setShowForm(true);
        }}
      >
        Create new bookshelf
      </button>
    </div>
  );
}

export default MyBooks;

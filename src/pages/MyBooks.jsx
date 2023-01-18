import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import deleteBookshelf from "../hooks/useDeleteBookshelf";
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

  //Sort the books into their selected shelves
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
      return myLibrary;
    }
  }

  //Add the bookshelf to the DB
  function handleSubmit(e) {
    e.preventDefault();
    try {
      addBookshelf(name(), currentUser().uid).then(function (data) {
        console.log("added data!");
        setShowForm(false);
        getBookshelves(currentUser().uid).then(function (data) {
          setBookshelves(data);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleDelete(e) {
    deleteBookshelf(e.target.value);
    getBooks(currentUser().uid).then(function (data) {
      setBooks(data);
    });
    getBookshelves(currentUser().uid).then(function (data) {
      setBookshelves(data);
    });
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
      <h2>My bookshelves:</h2>
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
            <div class={styles.card}>
              <img class={styles.bookIcon} src="src/assets/booksIcon.png"></img>
              <div
                class={styles.name}
                onClick={() => navigate(`/bookshelf/${library.shelf.id}`)}
              >{`${library.shelf.name} (${library.books.length})`}</div>
              <button
                class={styles.removeButton}
                value={JSON.stringify(library, null, 4)}
                onClick={(e) => {
                  handleDelete(e);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      <button
        class={styles.createButton}
        onClick={() => {
          setShowForm(true);
        }}
      >
        CREATE BOOKSHELF
      </button>
    </div>
  );
}

export default MyBooks;

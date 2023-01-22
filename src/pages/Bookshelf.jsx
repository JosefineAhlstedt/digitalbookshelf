import { Routes, Route, A, useParams, useNavigate } from "@solidjs/router";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBookshelf from "../hooks/useGetBookshelf";
import deleteBook from "../hooks/useDeleteBook";
import getBooks from "../hooks/useGetBooks";
import styles from "./Bookshelf.module.scss";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function Bookshelf() {
  const [books, setBooks] = createSignal();
  const [bookshelf, setBookshelf] = createSignal();
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  // createEffect(() => {
  //   if (currentUser().uid !== undefined) {
  //     const hello = getBooks(currentUser().uid, params.id);
  //     console.log("hello", hello);
  //     //Get the bookshelves that the user has
  //     return getBooks(currentUser().uid, params.id).then(function (data) {
  //       console.log("Data", data);
  //       setBooks(data);
  //     });
  //   }
  // });

  //Get the bookshelf
  createEffect(() => {
    getBookshelf(params.id).then(function (data) {
      setBookshelf(data);
    });
  });

  //Adds a listener for the books in the current bookshelf
  createEffect(() => {
    console.log("Hello");
    if (currentUser().uid !== undefined) {
      console.log("Test");
      const q = query(
        collection(db, "books"),
        where("userId", "==", params.user),
        where("bookshelfId", "==", params.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arrayWithBooks = [];
        querySnapshot.forEach((doc) => {
          console.log("DOC", doc);
          let bookObj = {
            id: doc.id,
            book: doc.data(),
          };
          arrayWithBooks.push(bookObj);
        });
        setBooks(arrayWithBooks);
        console.log("Books", books());
      });
      return unsubscribe;
    }
  });

  //Delete the selected shelf
  function handleDelete(e) {
    deleteBook(e.target.value);
    // return getBooks(currentUser().uid, params.id).then(function (data) {
    //   setBooks(data);
    // });
  }

  return (
    <div>
      {bookshelf() && <h2>{bookshelf().name}</h2>}
      {books() &&
        books().map((book) => {
          return (
            <div class={styles.card}>
              {book.book.img ? (
                <img src={`${book.book.img}`}></img>
              ) : (
                <div class={styles.noImage}>No image</div>
              )}

              <div class={styles.bookInfo}>
                <div
                  class={styles.title}
                  onClick={() => navigate(`/book/${book.id}`)}
                >{`${book.book.title}`}</div>
                <div>
                  {
                    <For each={book.book.authors}>
                      {(author, i) => <div>av {author}</div>}
                    </For>
                  }
                </div>
                <Show when={params.user === currentUser().uid}>
                  <button
                    class={styles.removeButton}
                    value={book.id}
                    onClick={(e) => handleDelete(e)}
                  >
                    Remove
                  </button>
                </Show>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Bookshelf;

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

  createEffect(() => {
    getBookshelf(params.id).then(function (data) {
      console.log("data", data);
      setBookshelf(data);
    });
  });

  createEffect(() => {
    if (currentUser().uid !== undefined) {
      const q = query(
        collection(db, "books"),
        where("userId", "==", currentUser().uid),
        where("bookshelfId", "==", params.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arrayWithBooks = [];
        querySnapshot.forEach((doc) => {
          let bookObj = {
            id: doc.id,
            book: doc.data(),
          };
          //console.log("Id", doc.id);
          arrayWithBooks.push(bookObj);
        });
        setBooks(arrayWithBooks);
        console.log("Current cities in CA: ", arrayWithBooks);
      });
      return unsubscribe;
    }
  });

  //Delete the selected shelf and then get the updated list
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
                <button
                  class={styles.removeButton}
                  value={book.id}
                  onClick={(e) => handleDelete(e)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Bookshelf;

import { Routes, Route, A, useParams, useNavigate } from "@solidjs/router";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBookshelf from "../hooks/useGetBookshelf";
import deleteBook from "../hooks/useDeleteBook";
import getBooks from "../hooks/useGetBooks";
import styles from "./Bookshelf.module.scss";
import BookAPI from "../services/BooksAPI";
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
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  createEffect(() => {
    //Get the clicked book and store it's data
    BookAPI.getBooksByAuthor(params.author).then((data) => {
      console.log("Books by author:", data);
      setBooks(data);
    });
  });

  return (
    <div>
      <h2>{params.author.replace("%20", " ")}</h2>
      {books() &&
        books().items.map((book) => {
          return (
            <div class={styles.card}>
              {book.volumeInfo.imageLinks ? (
                <img src={`${book.volumeInfo.imageLinks.thumbnail}`}></img>
              ) : (
                <div class={styles.noImage}>No image</div>
              )}

              <div class={styles.bookInfo}>
                <div
                  class={styles.title}
                  onClick={() => navigate(`/book/${book.id}`)}
                >{`${book.volumeInfo.title}`}</div>
                <div>
                  {
                    <For each={book.volumeInfo.authors}>
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

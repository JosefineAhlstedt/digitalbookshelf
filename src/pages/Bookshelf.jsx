import { Routes, Route, A, useParams, useNavigate } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import deleteBook from "../hooks/useDeleteBook";
import getBooks from "../hooks/useGetBooks";
import styles from "./Bookshelf.module.scss";

function Bookshelf() {
  const [books, setBooks] = createSignal();
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  createEffect(() => {
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      return getBooks(currentUser().uid, params.id).then(function (data) {
        //console.log("Data", data);
        setBooks(data);
      });
    }
  });

  function handleDelete(e) {
    deleteBook(e.target.value);
    return getBooks(currentUser().uid, params.id).then(function (data) {
      //console.log("Data", data);
      setBooks(data);
    });
  }

  return (
    <div>
      <h1>{params.id}</h1>
      {books() &&
        books().map((book) => {
          return (
            <div class={styles.card}>
              {book.book.img ? (
                <img src={`${book.book.img}`}></img>
              ) : (
                <div class={styles.noImage}>No image</div>
              )}

              <div>
                <h2
                  onClick={() => navigate(`/book/${book.id}`)}
                >{`${book.book.title}`}</h2>
                <div>
                  {
                    <For each={book.book.authors}>
                      {(author, i) => <div>av {author}</div>}
                    </For>
                  }
                </div>
                <button value={book.id} onClick={(e) => handleDelete(e)}>
                  Remove from shelf
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Bookshelf;

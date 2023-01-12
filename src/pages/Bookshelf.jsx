import { Routes, Route, A, useParams, useNavigate } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import styles from "./Bookshelf.module.scss";

function Bookshelf() {
  const [books, setBooks] = createSignal();
  const params = useParams();
  const navigate = useNavigate();

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      return getBooks(currentUser().uid, params.id).then(function (data) {
        console.log("Data", data);
        setBooks(data);
      });
    }
  });

  return (
    <div>
      <h1>{params.id}</h1>
      {books() &&
        books().map((book) => {
          return (
            <div
              onClick={() => navigate(`/book/${book.id}`)}
              class={styles.card}
            >
              {book.book.img ? (
                <img src={`${book.book.img}`}></img>
              ) : (
                <div class={styles.noImage}>No image</div>
              )}

              <div>
                <h2>{`${book.book.title}`}</h2>
                <div>
                  {
                    <For each={book.book.authors}>
                      {(author, i) => <div>av {author}</div>}
                    </For>
                  }
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Bookshelf;

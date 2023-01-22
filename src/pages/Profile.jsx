import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";
import getUser from "../hooks/useGetUser";
import styles from "./Profile.module.scss";
import { useNavigate, useParams } from "@solidjs/router";
import booksIcon from "../assets/booksIcon.png";

function Profile() {
  const [bookUser, setBookUser] = createSignal();
  const [books, setBooks] = createSignal();
  const [bookshelves, setBookshelves] = createSignal();
  const [library, setLibrary] = createSignal();
  const params = useParams();
  const navigate = useNavigate();

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

  createEffect(() => {
    setLibrary(sort(bookshelves(), books()));
  });

  createEffect(() => {
    if (params.id) {
      const user = getUser(params.id).then(function (data) {
        console.log("User!", data);
        setBookUser(data);
      });

      //Get the bookshelves that the user has
      getBooks(params.id).then(function (data) {
        console.log("Books", data);
        setBooks(data);
      });
      getBookshelves(params.id).then(function (data) {
        console.log("Bookshelves", data);
        setBookshelves(data);
      });
    } else {
      const user = getUser().then(function (data) {
        console.log("User!", data);
        setBookUser(data);
      });
    }
  });

  createEffect(() => {
    console.log("Got the data woop woop I love this", bookUser());
  });

  return (
    <div>
      {bookUser() && (
        <>
          <h1>{bookUser().username}</h1>
          <img class={styles.profilePhoto} src={`${bookUser().photoURL}`}></img>
        </>
      )}
      <h2>These are my books:</h2>
      {library() &&
        library().map((library) => {
          return (
            <div class={styles.card}>
              <img class={styles.bookIcon} src={booksIcon}></img>
              <div
                class={styles.name}
                onClick={() =>
                  navigate(`/bookshelf/${params.id}/${library.shelf.id}`)
                }
              >{`${library.shelf.name} (${library.books.length})`}</div>
            </div>
          );
        })}
    </div>
  );
}

export default Profile;

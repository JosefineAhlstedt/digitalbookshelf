import { Routes, Route, A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";
import getBookshelves from "../hooks/useGetBookshelves";
import getBooks from "../hooks/useGetBooks";

function MyBooks() {
  const [books, setBooks] = createSignal();

  function sort(shelves, userId) {
    Promise.all(shelves.map((shelf) => getBooks(userId, shelf))).then(
      (results) => {
        setBooks(results);
        return results;
      }
    );
  }

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      return getBookshelves(currentUser().uid).then(function (data) {
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
          return <h2>{`${library.shelf.name} (${library.books.length})`}</h2>;
        })}
    </div>
  );
}

export default MyBooks;

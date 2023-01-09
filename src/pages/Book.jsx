import { createSignal, createEffect, For, createMemo, onMount } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "../contexts/authContext";
import { auth, db, storage } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import addBook from "../hooks/useAddBook";

function Book() {
  const [bookData, setBookData] = createSignal(false);
  const [bookshelfID, setbookshelfID] = createSignal("");
  const params = useParams();
  const { currentUser } = useAuthContext();

  createEffect(() => {
    BookAPI.getOneBook(params.id).then((data) => {
      setBookData(data);
    });
  });

  const handleAdd = (e) => {
    console.log("click", currentUser().uid);
    let bookObject = {
      title: bookData().volumeInfo.title,
      authors: bookData().volumeInfo.authors,
      averageRating: bookData().volumeInfo.averageRating
        ? bookData().volumeInfo.averageRating
        : "none",
      publisher: bookData().volumeInfo.publisher,
      publishedDate: bookData().volumeInfo.publishedDate,
      img: bookData().volumeInfo.imageLinks.thumbnail
        ? bookData().volumeInfo.imageLinks.thumbnail
        : "",
      language: bookData().volumeInfo.language,
      ratingsCount: bookData().volumeInfo.ratingsCount
        ? bookData().volumeInfo.ratingsCount
        : "none",
    };

    //const bookshelvesRef = collection(db, "bookshelves");

    const q = query(
      collection(db, "bookshelves"),
      where("userId", "==", currentUser().uid)
    );

    const querySnapshot = getDocs(q);

    querySnapshot
      .then((result) => {
        result.forEach((doc) => {
          if (doc.data().name === e.target.name) {
            setbookshelfID(doc.id);
          }
        });
        addBook(bookObject, params.id, bookshelfID(), currentUser().uid).then(
          (data) => {
            console.log("added book");
          }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <div>
      {bookData() && (
        <>
          <h1>{bookData().volumeInfo.title}</h1>
          <img
            src={
              bookData().volumeInfo.imageLinks
                ? `${bookData().volumeInfo.imageLinks.thumbnail}`
                : ""
            }
          ></img>
          <div>
            <button name="Want to read" onClick={handleAdd}>
              Want to read
            </button>
            <button>Save to a bookshelf...</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Book;

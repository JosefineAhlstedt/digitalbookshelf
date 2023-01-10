import { createSignal, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";
import { useAuthContext } from "../contexts/authContext";
import addBook from "../hooks/useAddBook";
import getBookshelves from "../hooks/useGetBookshelves";
import styles from "./Book.module.scss";

function Book() {
  const [bookData, setBookData] = createSignal(false);
  const [bookshelfID, setbookshelfID] = createSignal("");
  const [bookshelf, setbookshelves] = createSignal("");
  const params = useParams();
  const { currentUser } = useAuthContext();

  createEffect(() => {
    BookAPI.getOneBook(params.id).then((data) => {
      setBookData(data);
    });
  });

  createEffect(() => {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      getBookshelves(currentUser().uid).then(function (data) {
        setbookshelves(data);
      });
    }
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
      img: bookData().volumeInfo.imageLinks
        ? bookData().volumeInfo.imageLinks.thumbnail
        : "",
      language: bookData().volumeInfo.language,
      ratingsCount: bookData().volumeInfo.ratingsCount
        ? bookData().volumeInfo.ratingsCount
        : "none",
    };

    try {
      bookshelf().forEach((shelf, i) => {
        console.log("Round:", i, e.target.name, e.target.value, shelf.name);
        console.log("shelf", shelf);
        if (shelf.name === e.target.name) {
          console.log("Match!", i, e.target.name, e.target.value, shelf.name);
          setbookshelfID(shelf.id);
        } else if (shelf.name === e.target.value) {
          setbookshelfID(shelf.id);
        } else {
          console.log("No match..", shelf.id);
        }
      });

      console.log("SHELF", bookshelf());

      addBook(bookObject, params.id, bookshelfID(), currentUser().uid).then(
        (data) => {
          console.log("added book");
        }
      );
    } catch (error) {
      console.log(error);
    }
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
            <div>
              <select name="" id="">
                <option>Choose bookshelf..</option>
                {bookshelf() &&
                  bookshelf().map((shelf) => {
                    return <option onClick={handleAdd}>{shelf.name}</option>;
                  })}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Book;

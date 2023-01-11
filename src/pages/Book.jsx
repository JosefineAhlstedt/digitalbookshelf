import { createSignal, createEffect, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";
import { useAuthContext } from "../contexts/authContext";
import addBook from "../hooks/useAddBook";
import addGrade from "../hooks/useAddGrade";
import getGrade from "../hooks/useGetGrade";
import getBookshelves from "../hooks/useGetBookshelves";
import styles from "./Book.module.scss";
import star from "../assets/Star.svg";

function Book() {
  const [bookData, setBookData] = createSignal(false);
  const [bookshelfID, setbookshelfID] = createSignal("");
  const [bookshelf, setbookshelves] = createSignal("");
  const [color, setColor] = createSignal("#D9D9D9");
  const params = useParams();
  const { currentUser } = useAuthContext();
  const stars = [1, 2, 3, 4, 5];
  const [amount, setAmount] = createSignal();
  const [voted, setVoted] = createSignal(false);
  const [grade, setGrade] = createSignal(0);

  createEffect(() => {
    BookAPI.getOneBook(params.id).then((data) => {
      setBookData(data);
    });
  });

  const renderStars = async (amount) => {
    for (let index = 0; index < amount; index++) {
      let el = document.getElementById(index + 1);
      el.attributes[2].value = "";
    }
  };

  createEffect(() => {
    if (currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      getBookshelves(currentUser().uid).then(function (data) {
        setbookshelves(data);
      });

      //Is there any grades?
      getGrade(currentUser().uid, bookData().id).then(function (data) {
        if (data !== undefined) {
          setVoted(true);
          renderStars(data.grade);
        }
      });
    }
  });

  const handleHover = async (e) => {
    if (voted() === false) {
      for (let index = 0; index < e.srcElement.id; index++) {
        let yellow = document.getElementById(index + 1);
        yellow.attributes[2].value = ""
          ? (yellow.attributes[2].value = "#D9D9D9")
          : (yellow.attributes[2].value = "");
      }
    }
  };

  const handleHover2 = async (e) => {
    if (voted() === false) {
      for (let index = 0; index < 5; index++) {
        let yellow = document.getElementById(index + 1);
        yellow.attributes[2].value = "#D9D9D9";
      }
    }
  };

  const handleVote = async (e) => {
    if (voted() === false) {
      setVoted(true);
      //Add grade to DB
      addGrade(currentUser().uid, bookData().id, e.srcElement.id);
      renderStars(e.srcElement.id);
    }
  };

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
        if (shelf.name === e.target.name) {
          setbookshelfID(shelf.id);
        } else if (shelf.name === e.target.value) {
          setbookshelfID(shelf.id);
        } else {
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
    <div class={styles.container}>
      {bookData() && (
        <>
          <div class={styles.img}>
            {bookData().volumeInfo.imageLinks ? (
              <img src={`${bookData().volumeInfo.imageLinks.thumbnail}`}></img>
            ) : (
              <div class={styles.noImage}>No image</div>
            )}
          </div>

          <div class={styles.info}>
            <div class={styles.title}>{bookData().volumeInfo.title}</div>
            {bookData().volumeInfo.authors.map((author) => {
              return <div class={styles.authors}>by {...author}</div>;
            })}
            <div class={styles.reviews}>
              <div>Average Rating: {bookData().volumeInfo.averageRating}</div>
              <div>Ratings: {bookData().volumeInfo.ratingsCount}</div>
            </div>
            <div class={styles.buttons}>
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
            <div id={styles.rating}>
              {
                <For each={stars}>
                  {(num, i) => (
                    <svg
                      class={styles.star}
                      viewBox="0 0 103 97"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id={num}
                        onmouseover={handleHover}
                        onmouseleave={handleHover2}
                        onClick={handleVote}
                        d="M51.5 0L63.5115 36.9676H102.382L70.935 59.8148L82.9465 96.7824L51.5 73.9352L20.0535 96.7824L32.065 59.8148L0.618477 36.9676H39.4885L51.5 0Z"
                        fill={color()}
                      />
                    </svg>
                  )}
                </For>
              }
            </div>
            <div
              class={styles.description}
              innerHTML={bookData().volumeInfo.description}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Book;

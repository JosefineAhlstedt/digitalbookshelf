import { createSignal, createEffect, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";
import { useAuthContext } from "../contexts/authContext";
import addBook from "../hooks/useAddBook";
import addGrade from "../hooks/useAddGrade";
import getGrade from "../hooks/useGetGrade";
import getUser from "../hooks/useGetUser";
import getBookshelves from "../hooks/useGetBookshelves";
import getReviews from "../hooks/useGetReviews";
import addReview from "../hooks/useAddReview";
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
  const [showForm, setShowForm] = createSignal(false);
  const [review, setReview] = createSignal(true);
  const [bookUser, setBookUser] = createSignal();
  const [reviews, setReviews] = createSignal();
  const [reviewsWithUsers, setReviewsWithUsers] = createSignal([]);

  createEffect(() => {
    BookAPI.getOneBook(params.id).then((data) => {
      setBookData(data);
    });
    //getReviews(bookData().id);
  });

  createEffect(() => {
    console.log("bookData()", bookData().id);
    getReviews(bookData().id).then(function (data) {
      console.log("DaTA", data);
      setReviews(data);
    });
  });

  createEffect(() => {
    if (reviews()) {
      let value = reviews().forEach((review) => {
        let reviewArray = [];
        const user = getUser(review.user).then(function (data) {
          console.log("User!!!", data, review);
          let reviewWithUser = {
            user: data,
            review: review,
          };
          console.log("reviewWithUser", reviewWithUser);
          if (reviewsWithUsers().length < reviews().length) {
            setReviewsWithUsers((reviewsWithUsers) => [
              reviewWithUser,
              ...reviewsWithUsers,
            ]);
          }

          //reviewArray.push(reviewWithUser);

          console.log("ARRAY", reviewArray);
          console.log("NOOOOO", reviewsWithUsers());
          return reviewArray;
          //setBookUser(data);
        });
      });

      if (reviewsWithUsers() !== undefined) {
        //setReviewsWithUsers(...reviewArray);
        //setReviewsWithUsers(value);
        console.log("reviewsWithUsers!!!", reviewsWithUsers());
      }
    }
  });

  const renderStars = async (amount) => {
    for (let index = 0; index < amount; index++) {
      let el = document.getElementById(index + 1);
      el.attributes[2].value = "";
    }
  };

  createEffect(() => {
    //console.log("currentUser", currentUser());
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

  function submitReview(e) {
    console.log("E", e);
  }

  function sendReview(e) {
    e.preventDefault();
    try {
      setShowForm(false);
      addReview(bookData().id, review(), currentUser().uid);

      //navigate(`/bookshelf/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  }

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
    <div class={showForm() ? styles.fade : styles.container}>
      <Show when={showForm()}>
        <div class={styles.form}>
          <form onSubmit={sendReview}>
            <button
              class={styles.closeButton}
              onClick={() => {
                setShowForm(false);
              }}
            >
              ✕
            </button>
            <p>Write your review...</p>
            <textarea
              onChange={(e) => {
                setReview(e.target.value);
                console.log(e.target.value);
              }}
            ></textarea>
            <button class={styles.createButton} type="submit">
              Send
            </button>
          </form>
        </div>
      </Show>
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
            <button onClick={(e) => submitReview(e)}>Write review</button>
            <div
              class={styles.description}
              innerHTML={bookData().volumeInfo.description}
            ></div>
            <div class={styles.textReviews}>
              <div>Reviews</div>
            </div>
            {reviewsWithUsers() &&
              reviewsWithUsers().map((obj) => {
                return (
                  <div class={styles.userReview}>
                    <img
                      class={styles.profilePhoto}
                      src={`${obj.user.photoURL}`}
                    ></img>
                    <div class={styles.textReview}>
                      <div>{obj.user.username} said: </div>
                      <div>{obj.review.review}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

export default Book;

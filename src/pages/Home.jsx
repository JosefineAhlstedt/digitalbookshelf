import getBooks from "../hooks/useGetBooks";
import { createSignal, createEffect, onMount } from "solid-js";
import { useAuthContext } from "../contexts/authContext";
import BookAPI from "../services/BooksAPI";
import logo from "../assets/logo.png";
import styles from "./Home.module.scss";
import { A } from "@solidjs/router";

function Home() {
  const [books, setBooks] = createSignal();
  const [categories, setCategories] = createSignal();
  const [topCategory, setTopCategory] = createSignal("");
  const { currentUser } = useAuthContext();

  createEffect(() => {
    if (topCategory() !== "") {
      //Get the clicked book and store it's data
      BookAPI.getBooksByCategory(topCategory()).then((data) => {
        setBooks(data);
      });
    }
  });

  function mostCommon(arr) {
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();
  }

  createEffect(() => {
    if (currentUser() && currentUser().uid !== undefined) {
      //Get the bookshelves that the user has
      getBooks(currentUser().uid).then(function (data) {
        let categoryArray = [];
        data.forEach((element) => {
          categoryArray.push(element.book.categories);
        });
        let superArray = [];
        categoryArray.forEach((array) => {
          if (array.length > 1 && array !== "none") {
            array.forEach((element) => {
              superArray.push(element);
            });
          } else if (array !== "none") {
            superArray.push(array[0]);
          }
        });

        const arrayWithSeparateGenres = [];
        superArray.forEach((categoryString) => {
          let firstIndex = categoryString.indexOf(" / ");
          let lastIndex = categoryString.lastIndexOf(" / ");
          let firstWord = categoryString.slice(0, firstIndex);
          let secondWord = categoryString
            .slice(firstIndex + 2, lastIndex)
            .trim(" ");
          let lastWord = categoryString.slice(
            lastIndex + 2,
            categoryString.length
          );
          arrayWithSeparateGenres.push(firstWord);
          arrayWithSeparateGenres.push(lastWord);
          if (secondWord !== "") {
            arrayWithSeparateGenres.push(secondWord);
          }
        });
        setTopCategory(mostCommon(arrayWithSeparateGenres));
      });
    }
  });
  return (
    <div>
      <Show
        when={currentUser()}
        fallback={
          <div class={styles.logoContainer}>
            <img class={styles.logo} src={logo}></img>
            <A href="/login">Login?</A>
          </div>
        }
      >
        <>
          <h1>Homepage</h1>
          <div>
            <h3>More from {topCategory()}:</h3>
            {
              books() && (
                <div class={styles.bookContainer}>
                  <img
                    class={styles.book}
                    src={`${books().items[0].volumeInfo.imageLinks.thumbnail}`}
                  />
                  <img
                    class={styles.book}
                    src={`${books().items[1].volumeInfo.imageLinks.thumbnail}`}
                  />
                  <img
                    class={styles.book}
                    src={`${books().items[3].volumeInfo.imageLinks.thumbnail}`}
                  />
                </div>
              )
              // books().items.map((obj) => {
              //   return <img src={`${obj.volumeInfo.imageLinks.thumbnail}`} />;
              // })
            }
          </div>
        </>
      </Show>
    </div>
  );
}

export default Home;

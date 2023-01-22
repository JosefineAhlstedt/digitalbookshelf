import { createSignal, createEffect, For, createMemo, onMount } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";
import styles from "./Search.module.scss";
import Pagination from "../components/Pagination/Pagination";
import { useNavigate } from "@solidjs/router";

function Search() {
  const [bookData, setBookData] = createSignal(false);
  const [searchData, setSearchData] = createSignal(0);
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    interval: 0,
  });
  const params = useParams();
  const navigate = useNavigate();

  createEffect(() => {
    if ({ ...searchParams }.interval !== undefined || NaN) {
      BookAPI.search(params.keyword, { ...searchParams }.interval).then(
        (data) => {
          setBookData(data.items);
          setSearchData(data.totalItems);
        }
      );
    } else {
      BookAPI.search(params.keyword, 0).then((data) => {
        setBookData(data.items);
        setSearchData(data.totalItems);
      });
    }
  });

  return (
    <>
      <div>
        {bookData() &&
          bookData().map((item) => (
            <div key={item.id} class={styles.infoContainer}>
              <img
                src={
                  item.volumeInfo.imageLinks
                    ? `${item.volumeInfo.imageLinks.thumbnail}`
                    : ""
                }
              ></img>
              <div class={styles.textInfo}>
                <h3
                  class={styles.title}
                  onClick={() => navigate(`/book/${item.id}`)}
                >
                  {item.volumeInfo.title}
                </h3>
                <div>
                  {
                    <For each={item.volumeInfo.authors}>
                      {(author, i) => <div>av {author}</div>}
                    </For>
                  }
                </div>
              </div>
            </div>
          ))}
      </div>
      <Pagination
        page={searchParams.page}
        total={searchData()}
        turnpage={setSearchParams}
      />
    </>
  );
}

export default Search;

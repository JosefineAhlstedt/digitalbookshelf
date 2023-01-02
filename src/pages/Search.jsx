import { createSignal, createEffect, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import BookAPI from "../services/BooksAPI";

function Search() {
  const [bookData, setBookData] = createSignal(false);
  const params = useParams();
  console.log("Params", params.keyword);

  createEffect(() => {
    BookAPI.search(params.keyword).then((data) => {
      setBookData(data);
      console.log("Bookdata", bookData());
    });
  });

  return (
    <ul>
      {bookData() &&
        bookData().map((item) => (
          <li key={item.id}>{item.volumeInfo.title}</li>
        ))}
    </ul>
  );
}

export default Search;

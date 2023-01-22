import styles from "./Pagination.module.scss";
import { createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";

function Pagination(props) {
  let pageTotal;
  let [searchParams, setSearchParams] = useSearchParams();

  onMount(() => {
    if (props.total !== 0) {
      pageTotal = Math.floor(props.total / 10);
      console.log("Pagination prop", pageTotal);
    }
  });

  const handlePage = (operator) => {
    if (operator === "+") {
      setSearchParams({
        page: Number({ ...searchParams }.page)
          ? Number({ ...searchParams }.page) + 1
          : 1,
        interval: Number({ ...searchParams }.interval)
          ? Number({ ...searchParams }.interval) + 10
          : 10,
      });
    } else {
      setSearchParams({
        page: Number({ ...searchParams }.page)
          ? Number({ ...searchParams }.page) - 1
          : 1,
        interval: Number({ ...searchParams }.interval)
          ? Number({ ...searchParams }.interval) - 10
          : 10,
      });
    }
  };

  return (
    <div class={styles.paginationContainer}>
      <button onClick={() => handlePage("-")} class={styles.paginationButton}>
        &lt;
      </button>
      {<button class={styles.paginationNumbers}>{props.page}</button>}
      <button
        onClick={() => handlePage("+")}
        //onClick={() => console.log("Click")}
        class={styles.paginationButton}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;

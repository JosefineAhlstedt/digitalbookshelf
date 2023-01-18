import { useNavigate } from "@solidjs/router";
import styles from "./Searchbar.module.scss";

function Searchbar() {
  const navigate = useNavigate();
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    navigate(`/results/${lowerCase}/0`);
  };
  return (
    <div class={styles.searchbar}>
      <input onChange={inputHandler} type="text" placeholder="Sök" />
      {/* <List input={bookData()} /> */}
    </div>
  );
}

export default Searchbar;

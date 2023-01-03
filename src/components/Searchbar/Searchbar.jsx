import { useNavigate } from "@solidjs/router";

function Searchbar() {
  const navigate = useNavigate();
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    navigate(`/results/${lowerCase}/0`);
  };
  return (
    <>
      <label>Sök: </label>
      <input onChange={inputHandler} type="text" placeholder="Sök" />
      {/* <List input={bookData()} /> */}
    </>
  );
}

export default Searchbar;

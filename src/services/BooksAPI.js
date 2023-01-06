import axios from "axios";
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const KEY = import.meta.env.VITE_API_KEY;

const search = async (keyword, index) => {
  const res = await axios.get(
    `${BASE_URL}${keyword}&startIndex=${index}&key=${KEY}`
  );
  console.log("res", res.data);
  return res.data;
};

const getOneBook = async (id) => {
  const res = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${id}`
  );
  console.log("res one book", res.data);
  return res.data;
};

const functions = {
  search,
  getOneBook,
};

export default functions;

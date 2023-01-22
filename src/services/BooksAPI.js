import axios from "axios";
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const KEY = import.meta.env.VITE_API_KEY;

const search = async (keyword, index) => {
  const res = await axios.get(
    `${BASE_URL}${keyword}&startIndex=${index}&key=${KEY}`
  );

  return res.data;
};

const getOneBook = async (id) => {
  const res = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${id}`
  );

  return res.data;
};

const getBooksByCategory = async (category) => {
  const res = await axios.get(`${BASE_URL}subject:${category}&key=${KEY}`);

  return res.data;
};

const getBooksByAuthor = async (author) => {
  const res = await axios.get(`${BASE_URL}inauthor:"${author}"&key=${KEY}`);

  return res.data;
};

const functions = {
  search,
  getOneBook,
  getBooksByCategory,
  getBooksByAuthor,
};

export default functions;

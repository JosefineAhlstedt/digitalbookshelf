import axios from "axios";
const BASE_URL = "https://www.googleapis.com/books/v1/volumes?q=";
const KEY = import.meta.env.VITE_API_KEY;

const search = async (keyword) => {
  const res = await axios.get(`${BASE_URL}${keyword}&key=${KEY}`);
  console.log("res", res.data.items);
  return res.data.items;
};

const functions = {
  search,
};

export default functions;

import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const deleteBookshelf = async (shelfWithBooks) => {
  let parsed = JSON.parse(shelfWithBooks);
  console.log("parsed", parsed.shelf.id);
  await deleteDoc(doc(db, "bookshelves", parsed.shelf.id));
  parsed.books.forEach((book) => {
    deleteDoc(doc(db, "books", book.id));
  });

  console.log("deleted bookshelf with books!");
};

export default deleteBookshelf;

import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

const deleteBookshelf = async (shelfWithBooks) => {
  let parsed = JSON.parse(shelfWithBooks);
  await deleteDoc(doc(db, "bookshelves", parsed.shelf.id));
  parsed.books.forEach((book) => {
    deleteDoc(doc(db, "books", book.id));
  });
};

export default deleteBookshelf;

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const addBook = async (bookObject, bookId, bookshelf, id) => {
  await setDoc(doc(db, "books", bookId), {
    ...bookObject,
    userId: id,
    bookshelfId: bookshelf,
  });
};

export default addBook;

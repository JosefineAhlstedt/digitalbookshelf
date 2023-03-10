import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const deleteBook = async (bookId) => {
  await deleteDoc(doc(db, "books", bookId));
};

export default deleteBook;

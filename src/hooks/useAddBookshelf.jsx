import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const addBookshelf = async (name, id) => {
  await addDoc(collection(db, "bookshelves"), {
    userId: id,
    name: name,
  });
};

export default addBookshelf;

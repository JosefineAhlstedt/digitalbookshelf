import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const createShelf = async (name, userID) => {
  await setDoc(doc(db, "bookshelves"), {
    userId: userID,
    name: name,
  });
};

export default createShelf;

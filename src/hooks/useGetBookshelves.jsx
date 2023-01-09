import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const getBookshelves = async (id) => {
  const q = query(collection(db, "bookshelves"), where("userId", "==", id));
  const arrayWithBookshelves = [];

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let shelf = doc.data();
    shelf.id = doc.id;
    arrayWithBookshelves.push(shelf);
  });

  if (arrayWithBookshelves !== []) {
    return arrayWithBookshelves;
  }
};

export default getBookshelves;

import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const getBooks = async (id, bookshelf) => {
  const q = query(
    collection(db, "books"),
    where("userId", "==", id),
    where("bookshelfId", "==", bookshelf.id)
  );
  const arrayWithBooks = [];

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    arrayWithBooks.push(doc.data());
  });

  if (arrayWithBooks !== []) {
    const bookObject = {
      books: arrayWithBooks,
      shelf: bookshelf,
    };
    return bookObject;
  }
};

export default getBooks;

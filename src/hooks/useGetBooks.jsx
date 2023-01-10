import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { createSignal } from "solid-js";

const getBooks = async (id, bookshelfID) => {
  let q;
  if (bookshelfID !== undefined) {
    console.log("We have id!");
    q = query(
      collection(db, "books"),
      where("userId", "==", id),
      where("bookshelfId", "==", bookshelfID)
    );
  } else {
    console.log("No id....");
    q = query(collection(db, "books"), where("userId", "==", id));
  }

  const arrayWithBooks = [];

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    arrayWithBooks.push(doc.data());
  });

  if (arrayWithBooks !== []) {
    const bookObject = {
      books: arrayWithBooks,
    };
    return bookObject;
  }
};

export default getBooks;

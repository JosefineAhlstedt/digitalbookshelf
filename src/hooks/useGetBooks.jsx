import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { createSignal } from "solid-js";

const getBooks = async (id, bookshelfID) => {
  let q;
  if (bookshelfID !== undefined) {
    q = query(
      collection(db, "books"),
      where("userId", "==", id),
      where("bookshelfId", "==", bookshelfID)
    );
  } else {
    q = query(collection(db, "books"), where("userId", "==", id));
  }

  const arrayWithBooks = [];

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    let bookObj = {
      id: doc.id,
      book: doc.data(),
    };
    //console.log("Id", doc.id);
    arrayWithBooks.push(bookObj);
  });

  if (arrayWithBooks !== []) {
    // const bookObject = {
    //   books: arrayWithBooks,
    // };
    return arrayWithBooks;
  }
};

export default getBooks;

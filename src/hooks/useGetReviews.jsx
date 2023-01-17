import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const getReviews = async (id) => {
  if (id !== undefined) {
    console.log("ID", id);
    const q = query(collection(db, "reviews"), where("bookId", "==", id));
    const arrayWithBookshelves = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log("HIIII", doc.id, doc.data());
      let review = doc.data();
      // review.bookId = doc.id;
      arrayWithBookshelves.push(review);
    });

    if (arrayWithBookshelves !== []) {
      return arrayWithBookshelves;
    }
  }
};

export default getReviews;

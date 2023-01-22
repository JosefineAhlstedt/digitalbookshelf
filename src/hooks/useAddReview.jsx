import { db } from "../firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const addReview = async (bookId, review, id) => {
  await addDoc(collection(db, "reviews"), {
    review: review,
    user: id,
    bookId: bookId,
  });
};

export default addReview;

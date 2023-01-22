import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const addGrade = async (id, bookId, grade) => {
  await addDoc(collection(db, "grades"), {
    grade: grade,
    userId: id,
    bookId: bookId,
  });
};

export default addGrade;

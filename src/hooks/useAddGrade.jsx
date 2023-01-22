import { db } from "../firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const addGrade = async (id, bookId, grade) => {
  await addDoc(collection(db, "grades"), {
    grade: grade,
    userId: id,
    bookId: bookId,
  });
};

export default addGrade;

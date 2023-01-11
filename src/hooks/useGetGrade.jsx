import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const getGrades = async (id, bookId) => {
  let grade;

  if (id && bookId !== undefined) {
    let q = query(
      collection(db, "grades"),
      where("userId", "==", id),
      where("bookId", "==", bookId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      grade = doc.data();
    });
  }
  return grade;
};

export default getGrades;

import { db } from "../firebase";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const getBookshelf = async (id) => {
  const docRef = doc(db, "bookshelves", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    return console.log("No such document!");
  }
};

export default getBookshelf;

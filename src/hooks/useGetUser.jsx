import { db } from "../firebase";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { useAuthContext } from "../contexts/authContext";

const getUser = async (id) => {
  if (!id) {
    const { currentUser } = useAuthContext();
    if (currentUser().uid !== undefined) {
      const docRef = doc(db, "users", currentUser().uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        return console.log("No such document!");
      }
    }
  } else {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      return console.log("No such document!");
    }
  }
};

export default getUser;

import { createSignal, createContext, useContext, onMount } from "solid-js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [count, setCount] = createSignal(5);
  const [userEmail, setUserEmail] = createSignal("testmail");
  const [currentUser, setcurrentUser] = createSignal("Noone");

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signup = async (email, username, password, photo) => {
    await createUserWithEmailAndPassword(auth, email, password);

    const photoRef = ref(
      storage,
      `photos/${auth.currentUser.email}/${photo.name}`
    );

    const uploadResult = await uploadBytes(photoRef, photo);

    let photoURL = await getDownloadURL(uploadResult.ref);

    const docRef = doc(db, "users", auth.currentUser.uid);

    await setDoc(docRef, {
      email: email,
      username: username,
      photoURL: photoURL,
    });
  };

  const authvariables = {
    count,
    userEmail,
    login,
    currentUser,
    logout,
    signup,
  };

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setcurrentUser(user);
    });
    return unsubscribe;
  });

  return (
    <AuthContext.Provider value={authvariables}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

import { createSignal, createContext, useContext, onMount } from "solid-js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [count, setCount] = createSignal(props.count ?? 5);
  const [userEmail, setUserEmail] = createSignal("testmail");
  const [currentUser, setcurrentUser] = createSignal(null);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signup = async (email, username, password) => {
    await createUserWithEmailAndPassword(auth, email, password);

    const docRef = doc(db, "users", auth.currentUser.uid);

    await setDoc(docRef, {
      email: email,
      username: username,
      photoURL: "photoURL",
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

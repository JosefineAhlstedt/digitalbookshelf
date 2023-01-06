import { Routes, Route, A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { collection, query, where, getDocs } from "firebase/firestore";

function MyBooks() {
  const [first, setFirst] = createSignal("JSON");
  const [last, setLast] = createSignal("Bourne");
  //const q = query(collection(db, "cities"), where("capital", "==", true));

  createEffect(() => console.log(`${first()} ${last()}`));
  return (
    <div>
      <h1>These are my books</h1>
    </div>
  );
}

export default MyBooks;

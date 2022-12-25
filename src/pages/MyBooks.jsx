import { Routes, Route, A } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"

function MyBooks() {
  const [first, setFirst] = createSignal("JSON")
  const [last, setLast] = createSignal("Bourne")

  createEffect(() => console.log(`${first()} ${last()}`))
  return (
    <div>
      <h1>These are my books</h1>
    </div>
  )
}

export default MyBooks

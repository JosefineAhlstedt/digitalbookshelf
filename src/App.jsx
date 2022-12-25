import styles from "./App.module.css"
import { Routes, Route, A } from "@solidjs/router"
import { lazy } from "solid-js"
const MyBooks = lazy(() => import("./pages/MyBooks"))
const Home = lazy(() => import("./pages/Home"))
const Navbar = lazy(() => import("./components/Navbar/Navbar"))
const Login = lazy(() => import("./pages/Login"))

function App() {
  return (
    <div class={styles.App}>
      <Navbar />
      <h1>My Site with Lots of Pages</h1>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/mybooks" component={MyBooks} />
        <Route path="/login" component={Login} />
      </Routes>
    </div>
  )
}

export default App

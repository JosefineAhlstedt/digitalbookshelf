import styles from "./App.module.css";
import { Routes, Route } from "@solidjs/router";
import { lazy } from "solid-js";
const MyBooks = lazy(() => import("./pages/MyBooks"));
const Home = lazy(() => import("./pages/Home"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Logout"));
const Register = lazy(() => import("./pages/Register"));
const Search = lazy(() => import("./pages/Search"));
const Book = lazy(() => import("./pages/Book"));
const Bookshelf = lazy(() => import("./pages/Bookshelf"));
const Profile = lazy(() => import("./pages/Profile"));
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div class={styles.App}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          component={Home}
          // element={
          //   <RequireAuth>
          //     <Home />
          //   </RequireAuth>
          // }
        />
        <Route path="/mybooks" component={MyBooks} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/results/:keyword/:page" component={Search} />
        <Route path="/book/:id" component={Book} />
        <Route path="/bookshelf/:id" component={Bookshelf} />
        <Route path="/profile" component={Profile} />
      </Routes>
    </div>
  );
}

export default App;

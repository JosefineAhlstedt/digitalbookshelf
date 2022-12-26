import styles from "./App.module.css";
import { Routes, Route, A } from "@solidjs/router";
import { lazy } from "solid-js";
const MyBooks = lazy(() => import("./pages/MyBooks"));
const Home = lazy(() => import("./pages/Home"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/Logout"));
const Register = lazy(() => import("./pages/Register"));
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div class={styles.App}>
      <Navbar />
      <h1>My Site with Lots of Pages</h1>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/mybooks" component={MyBooks} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
      </Routes>
    </div>
  );
}

export default App;

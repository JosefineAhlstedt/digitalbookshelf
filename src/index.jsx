/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { FirebaseProvider } from "solid-firebase";
import { AuthProvider } from "./contexts/authContext";

import "./index.css";
import App from "./App";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

render(
  () => (
    <Router>
      <FirebaseProvider config={firebaseConfig}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  ),
  document.getElementById("root")
);

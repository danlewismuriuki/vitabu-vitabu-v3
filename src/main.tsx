import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { setupFirebaseAuth } from "./utils/firebaseAuth";

const init = async () => {
  await setupFirebaseAuth();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

init();

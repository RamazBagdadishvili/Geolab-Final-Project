import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ShelfProvider } from "./context/ShelfContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ShelfProvider>
        <App />
      </ShelfProvider>
    </BrowserRouter>
  </StrictMode>,
);

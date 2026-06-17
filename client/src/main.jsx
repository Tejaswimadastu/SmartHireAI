import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./styles/Global.css";
import "./styles/Login.css";
import "./styles/Register.css";

import {
  ThemeProvider
} from "./context/ThemeContext";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

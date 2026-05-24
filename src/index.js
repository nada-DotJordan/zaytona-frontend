import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./languages/LanguageContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
document.documentElement.style.scrollBehavior = "smooth";

root.render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
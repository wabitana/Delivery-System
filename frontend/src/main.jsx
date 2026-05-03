import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "!border !border-white/25 !bg-white/90 !text-slate-900 !shadow-xl !backdrop-blur-xl dark:!border-white/10 dark:!bg-slate-900/85 dark:!text-slate-50"
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

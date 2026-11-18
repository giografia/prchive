import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./router";
import AppDataProvider from "./context/AppDataProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppDataProvider>
      <RouterProvider router={router} />
    </AppDataProvider>
  </StrictMode>,
);

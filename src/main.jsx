import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes.jsx";
import CartProvider from "./contexts/cartProvider.jsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router}></RouterProvider>
    </CartProvider>
  </StrictMode>,
);

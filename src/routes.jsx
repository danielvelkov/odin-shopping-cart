import Root from "./routes/root";
import ErrorPage from "/src/routes/ErrorPage";
import Products from "./routes/products";
import { loader as productsLoader } from "./routes/products";

const routes = [
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/products",
        element: <Products></Products>,
        errorElement: <ErrorPage></ErrorPage>,
        loader: productsLoader,
      },
    ],
  },
];

export default routes;

import Root from "./routes/root";
import ErrorPage from "/src/routes/ErrorPage";
import Products from "./routes/products";
import { loader as productsLoader } from "./routes/products";
import { loader as productLoader } from "./routes/product";
import Product from "./routes/product";

const routes = [
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/products",
        element: <Products></Products>,
        loader: productsLoader,
      },
      {
        path: "/products/:productId",
        element: <Product></Product>,
        loader: productLoader,
      },
    ],
  },
];

export default routes;

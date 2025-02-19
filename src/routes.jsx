import Root from "./routes/root";
import ErrorPage from "/src/routes/ErrorPage";
import Products from "./routes/products";
import {
  loader as productsLoader,
  categoryProductsLoader,
} from "./routes/products";
import { loader as productLoader } from "./routes/product";
import Product from "./routes/product";
import Cart from "./routes/cart";

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
        path: "/products/categories/:category",
        element: <Products></Products>,
        loader: categoryProductsLoader,
      },
      {
        path: "/products/:productId",
        element: <Product></Product>,
        loader: productLoader,
      },
      {
        path: "/cart",
        element: <Cart></Cart>,
      },
    ],
  },
];

export default routes;

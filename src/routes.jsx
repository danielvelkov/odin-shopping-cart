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
import Favorites from "./routes/favorites";
import Home from "./routes/home";

export const RouteIds = Object.freeze({
  Index: "index",
  Home: "home",
  Products: "products",
  ProductsByCategory: "products-categories",
  Product: "product",
  Cart: "cart",
  Favorites: "favorites",
});

const routes = [
  {
    path: "/",
    id: RouteIds.Index,
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { index: true, id: RouteIds.Home, element: <Home></Home> },
      {
        path: "/products",
        id: RouteIds.Products,
        element: <Products></Products>,
        loader: productsLoader,
      },
      {
        path: "/products/categories/:category",
        id: RouteIds.ProductsByCategory,
        element: <Products></Products>,
        loader: categoryProductsLoader,
      },
      {
        path: "/products/:productId",
        id: RouteIds.Product,
        element: <Product></Product>,
        loader: productLoader,
      },
      {
        path: "/cart",
        id: RouteIds.Cart,
        element: <Cart></Cart>,
      },
      {
        path: "/favorites",
        id: RouteIds.Favorites,
        element: <Favorites></Favorites>,
      },
    ],
  },
];

export default routes;

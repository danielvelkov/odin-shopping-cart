import Root from "./routes/root";
import ErrorPage from "/src/routes/ErrorPage";

const routes = [
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
  },
];

export default routes;

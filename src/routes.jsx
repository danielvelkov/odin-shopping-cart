import App from '/src/App';
import ErrorPage from '/src/routes/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
  },
];

export default routes;

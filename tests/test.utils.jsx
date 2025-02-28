import { render } from "@testing-library/react";
import CartProvider from "../src/contexts/cartProvider";
import PropTypes from "prop-types";

const AllAppProviders = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllAppProviders, ...options });

AllAppProviders.propTypes = {
  children: PropTypes.array,
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

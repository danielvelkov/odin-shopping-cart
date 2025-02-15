import PropTypes from "prop-types";
import { useReducer } from "react";
import CartActions from "./action-types/cartActions";
import CartContext from "src/contexts/cartContext";

function cartReducer(prevCartItems, action) {
  const { id, type, newQuantity } = action;

  switch (type) {
    case CartActions.ADD: {
      if (id && !prevCartItems.has(id))
        return new Map(prevCartItems).set(id, { quantity: 1 });
      else if (prevCartItems.has(id))
        return new Map(prevCartItems).set(id, {
          ...prevCartItems.get(id),
          quantity: prevCartItems.get(id).quantity + 1,
        });
      else throw new Error("No product ID provided");
    }
    case CartActions.REMOVE: {
      return new Map(
        [...prevCartItems].filter(([productId]) => productId !== id),
      );
    }
    case CartActions.UPDATE: {
      if (id && prevCartItems.has(id))
        return new Map(prevCartItems).set(id, {
          ...prevCartItems.get(id),
          quantity: Number(newQuantity),
        });
      return prevCartItems;
    }
    default: {
      return prevCartItems;
    }
  }
}

const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, new Map());

  return (
    <CartContext.Provider value={{ cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.array,
};

export default CartProvider;

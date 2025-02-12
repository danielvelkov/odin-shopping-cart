import { useContext } from "react";
import CartContext from "src/contexts/cartContext";
import PropTypes from "prop-types";

const AddToCartButton = ({ id, className }) => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const handleClick = () => {
    if (id && !cartItems.includes(id)) setCartItems([...cartItems, id]);
  };
  return (
    <button className={className} onClick={handleClick}>
      Add to Cart
      <i className="fa fa-shopping-cart"></i>
    </button>
  );
};

export default AddToCartButton;

AddToCartButton.propTypes = {
  id: PropTypes.number.isRequired,
  className: PropTypes.string,
};

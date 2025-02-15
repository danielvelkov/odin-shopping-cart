import { useContext } from "react";
import CartContext from "src/contexts/cartContext";
import PropTypes from "prop-types";
import CartActions from "../contexts/action-types/cartActions";

const AddToCartButton = ({ id, className }) => {
  const { dispatch } = useContext(CartContext);

  const handleClick = () => {
    dispatch({ type: CartActions.ADD, id });
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

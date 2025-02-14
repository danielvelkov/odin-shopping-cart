import { useContext } from "react";
import CartContext from "src/contexts/cartContext";
import PropTypes from "prop-types";

const AddToCartButton = ({ id, className }) => {
  const { setCartItems } = useContext(CartContext);

  const handleClick = () => {
    setCartItems((prev) => {
      if (id && !prev.has(id)) return new Map(prev).set(id, { quantity: 1 });
      else if (prev.has(id))
        return new Map(prev).set(id, {
          ...prev.get(id),
          quantity: prev.get(id).quantity + 1,
        });
    });
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

import { useContext } from "react";
import FavoritesContext from "src/contexts/favoritesContext";
import PropTypes from "prop-types";

const AddToFavoritesButton = ({ id, className }) => {
  const { favorites, setFavorites } = useContext(FavoritesContext);

  const handleClick = () => {
    if (favorites.includes(id))
      setFavorites([...favorites.filter((e) => e !== id)]);
    else setFavorites([...favorites, id]);
  };
  return (
    <button className={className} onClick={handleClick}>
      {favorites.includes(id) ? (
        <i className="fas fa-heart"></i>
      ) : (
        <i className="far fa-heart"></i>
      )}
    </button>
  );
};

export default AddToFavoritesButton;

AddToFavoritesButton.propTypes = {
  id: PropTypes.number.isRequired,
  className: PropTypes.string,
};

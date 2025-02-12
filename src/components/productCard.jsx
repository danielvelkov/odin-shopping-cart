import styled from "styled-components";
import PropTypes from "prop-types";
import StarRating from "./starRating";
import AddToCartButton from "./addToCartButton";
import { USDollar } from "../utils/priceFormatter";
import AddToFavoritesButton from "./addToFavoritesButton";

const ProductCard = ({ product }) => {
  const { id, title, price, rating, description, image } = product;
  const { rate, count } = rating;

  return (
    <Card>
      <div className="card-img">
        <img src={image}></img>
      </div>
      <div className="card-info">
        <h4 className="title">{title}</h4>
        <StarRating rating={rate} votes={count}></StarRating>
        <p className="text-body">{description}</p>
      </div>
      <div className="card-footer">
        <span className="text-title">{USDollar.format(price)}</span>
        <div className="card-buttons">
          <AddToCartButton className={"card-button"} id={id}></AddToCartButton>
          <AddToFavoritesButton
            className={"card-button favorite"}
            id={id}
          ></AddToFavoritesButton>
        </div>
      </div>
    </Card>
  );
};

export const Card = styled.article`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  max-width: 250px;
  padding: 1em;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);

  .title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }

  .card-img {
    flex: 1 0 50%;
    border-radius: 1em;
    background-color: white;
    display: flex;
    padding: 1em 0em;
    justify-content: center;
    img {
      object-fit: contain;
      width: 100%;
      aspect-ratio: 1/1;
    }
  }

  .card-info {
    flex: auto;
  }

  .card-footer {
    flex: 0;
    display: flex;
    align-items: center;
    padding-top: 1em;
    gap: 1em;
    border-top: 1px solid #ddd;
  }

  /*Text*/
  .text-title {
    font-weight: 900;
    font-size: 1.2em;
    line-height: 1.5;
  }

  .text-body {
    height: 1em;
    font-size: 0.8em;
    padding-bottom: 1em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .card-buttons {
    flex: 1;
    display: flex;
    gap: 5px;
    align-items: center;

    button:first-child {
      flex: 1;
    }
  }

  /*Button*/
  .card-button {
    border: 1px solid #252525;
    padding: 0.5em;
    cursor: pointer;
    border-radius: 0.5em;
    text-align: center;
  }

  /* Favorite */
  .favorite {
    color: red;
  }

  /* On hover */
  &:hover,
  &:focus {
    color: #2033a1ae;
    cursor: pointer;
    .card-img {
      transform: scale(1.1);
    }
  }
`;

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
  }),
};

export default ProductCard;

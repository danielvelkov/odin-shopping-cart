import styled from "styled-components";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const { title, price, rating, description, image } = product;
  const { rate, count } = rating;

  const starRating = [...Array(5)].map((r, i) => {
    let starIcon;
    if (i + 1 <= rate) starIcon = <i className="fa fa-star"></i>;
    else if (i + 1 > rate && i + 1 == Math.ceil(rate))
      starIcon = <i className="fa fa-star-half"></i>;
    return starIcon;
  });

  return (
    <Card>
      <div className="card-img">
        <img src={image}></img>
      </div>
      <div className="card-info">
        <h4 className="title">{title}</h4>
        <span className="sub-title">{starRating}</span>
        <span className="muted">({count})</span>
        <p className="text-body">{description}</p>
      </div>
      <div className="card-footer">
        <span className="text-title">{price}$</span>
        <div className="card-buttons">
          <button className="card-button">
            Add to cart
            <i className="fa fa-shopping-cart"></i>
          </button>
          <button className="card-button favorite">
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </Card>
  );
};

const Card = styled.article`
  max-width: 250px;
  padding: 0.8em;
  position: relative;
  overflow: visible;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);

  .muted {
    color: #a3a4b4;
  }

  .title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }

  .sub-title {
    color: orange;
    text-shadow: 1px 1px 2px gray;
  }

  .card-img {
    border-radius: 1em;
    background-color: white;
    display: flex;
    padding: 1em 0em;
    justify-content: center;
    img {
      object-fit: contain;
      max-width: 50%;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1em;
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
    padding-bottom: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .card-buttons {
    display: flex;
    gap: 5px;
  }

  /*Button*/
  .card-button {
    border: 1px solid #252525;
    display: flex;
    padding: 0.5em;
    cursor: pointer;
    border-radius: 0.5em;
    align-items: center;
  }

  /* Favorite */
  .favorite {
    color: red;
  }
`;

ProductCard.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
  }),
};

export default ProductCard;

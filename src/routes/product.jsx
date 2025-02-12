import { useLoaderData } from "react-router-dom";
import styled from "styled-components";
import { getProduct } from "src/products";
import StarRating from "src/components/starRating";
import AddToCartButton from "src/components/addToCartButton";
import { USDollar } from "src/utils/priceFormatter";

export async function loader({ params }) {
  const product = await getProduct(params.productId);
  return { product };
}

const Product = () => {
  const { product } = useLoaderData();
  const { rate, count } = product.rating;

  return (
    <ProductWrapper>
      <div className="image-container">
        <img src={product.image}></img>
      </div>
      <div className="product-info">
        <h2>{product.title}</h2>
        <span className="product-price">{USDollar.format(product.price)}</span>
        <StarRating rating={rate} votes={count}></StarRating>
        <p>{product.description}</p>
        <div className="button-list">
          <AddToCartButton id={product.id}></AddToCartButton>
          <button>
            Add to favorites <i className="fa fa-heart"></i>
          </button>
        </div>
      </div>
    </ProductWrapper>
  );
};

const ProductWrapper = styled.article`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1em;

  .image-container {
    height: 100%;
    background-color: white;
    padding: 2em;
    display: flex;
    justify-content: center;
  }

  .image-container > img {
    max-height: 50vh;
    max-width: 40vw;
  }

  .product-info {
    max-width: 52ch;

    display: flex;
    flex-direction: column;
    padding: 1em 2em;
    font-size: 1.3em;
    box-shadow: 2px 2px 10px darkgray;
    line-height: 1.5em;
  }

  .product-price {
    font-weight: 900;
    font-size: 1.5em;
    line-height: 2;
  }

  .button-list {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    button {
      font-size: 1em;
      font-weight: 600;
      padding: 0.5em 1em;
    }
  }

  @media screen and (max-width: 720px) {
    flex-direction: column;
    gap: 0;
  }
`;

export default Product;

import { useLoaderData, useNavigate } from "react-router-dom";
import { getProducts } from "/src/products";
import ProductCard from "/src/components/productCard";
import styled from "styled-components";
import { Card } from "../components/productCard";

export async function loader() {
  const products = await getProducts();
  return { products };
}

const Products = () => {
  const navigate = useNavigate();
  const { products } = useLoaderData();
  return (
    <>
      <h2>Products</h2>
      <SearchBar>
        <form id="product-search" role="search">
          <input
            id="q"
            aria-label="Search products"
            placeholder="Search"
            type="search"
            name="q"
          />
          <div id="search-spinner" aria-hidden hidden={true} />
        </form>
        <form method="post">
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </SearchBar>
      {products.length ? (
        <CardList>
          {products.map((product) => (
            <li
              key={product.id}
              onClick={() => navigate("/products/" + product.id)}
            >
              <ProductCard product={product}></ProductCard>
            </li>
          ))}
        </CardList>
      ) : (
        "No products available yet"
      )}
    </>
  );
};

export default Products;

const CardList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  padding: 0;

  li > ${Card} {
    min-height: 100%;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5em;

  form input[type="search"] {
    min-width: 42ch;
    padding: 0.5em 1em;
    border-radius: 1em;
    border: 1px solid gray;
  }

  form button[type="submit"] {
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    background-color: transparent;
    border: none;
  }
`;

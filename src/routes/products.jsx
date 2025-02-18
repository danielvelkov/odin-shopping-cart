import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { getProducts } from "/src/products";
import ProductCard from "/src/components/productCard";
import styled from "styled-components";
import { Card } from "../components/productCard";
import { useEffect } from "react";

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const products = await getProducts(query);
  return { products, query };
}

const Products = () => {
  const navigate = useNavigate();
  const { products, query } = useLoaderData();

  useEffect(() => {
    document.getElementById("q").value = query;
  }, [query]);

  return (
    <>
      <h2>Products</h2>
      <SearchBar>
        <Form id="product-search">
          <input
            id="q"
            aria-label="Search products"
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={query}
          />
          <div id="search-spinner" aria-hidden hidden={true} />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </Form>
        <div className="search-results">
          {products.length
            ? products.length === 1
              ? "1 result"
              : `${products.length} results`
            : "no results found"}
        </div>
      </SearchBar>
      {products.length ? (
        <CardList>
          {products.map((product) => (
            <li
              aria-label={product.title + " product"}
              role="link"
              tabIndex={0}
              key={product.id}
              onKeyDown={(e) =>
                e.key === "Enter" ? navigate("/products/" + product.id) : true
              }
              onClick={(e) => {
                if (e.target.matches("button, button *")) return;
                else navigate("/products/" + product.id);
              }}
            >
              <ProductCard product={product}></ProductCard>
            </li>
          ))}
        </CardList>
      ) : (
        <>
          <h2>No results for &quot;{query}&quot;</h2>
          <p>Check the spelling or try a more general search term.</p>
        </>
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
  flex-wrap: wrap;
  gap: 0.5em;

  form input[type="search"] {
    min-width: 42ch;
    padding: 0.5em 1em;
    border-radius: 1em;
    border: 1px solid gray;
    &:hover {
      box-shadow: 0 0 10px rgb(0, 0, 0, 0.3);
    }
  }

  form button[type="submit"] {
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    background-color: transparent;
    border: none;
    margin-left: -3em;
  }

  .search-results {
    color: #666;
  }
`;

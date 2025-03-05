import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import ProductCard from "/src/components/productCard";
import styled from "styled-components";
import { Card } from "../components/productCard";
import { useEffect } from "react";
import {
  getPaginatedProducts,
  getProducts,
  getProductsByCategory,
} from "../products";
import LoadingSpinner from "../components/loadingSpinner";
import { FilterNames } from "../constants/filterNames";
import CheckmarkButton from "../components/checkmarkButton";
import { ProductSortingNames } from "../constants/productSortingNames";
import { camelCaseToWords } from "../utils/stringCaseConverter";
import Pagination from "../components/pagination";

function filterProductsBySearchParams(products, searchParams) {
  const minProductPrice = searchParams.get(FilterNames.MIN_PRICE);
  const maxProductPrice = searchParams.get(FilterNames.MAX_PRICE);
  const minRating = searchParams.get(FilterNames.MIN_RATING);
  if (minProductPrice)
    products = products.filter((p) => p.price >= minProductPrice);
  if (maxProductPrice)
    products = products.filter((p) => p.price < maxProductPrice);
  if (minRating) products = products.filter((p) => p.rating.rate > minRating);

  return products;
}

function sortProducts(products, sortingType) {
  switch (sortingType) {
    case ProductSortingNames.BY_PRICE_ASCENDING:
      products.sort((p1, p2) => p1.price - p2.price);
      break;
    case ProductSortingNames.BY_PRICE:
      products.sort((p1, p2) => p2.price - p1.price);
      break;
    case ProductSortingNames.BY_RATING_ASCENDING:
      products.sort((p1, p2) => p1.rating.rate - p2.rating.rate);
      break;
    case ProductSortingNames.BY_RATING:
      products.sort((p1, p2) => p2.rating.rate - p1.rating.rate);
      break;
    default:
  }
  return products;
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const sortingType = url.searchParams.get("sort");
  const pageNumber = url.searchParams.get(FilterNames.PAGE) ?? 1;
  const pageSize = url.searchParams.get(FilterNames.PAGE_SIZE) ?? 10;
  let { products, pages } = getPaginatedProducts(
    await getProducts(searchQuery, pageSize, pageNumber),
    pageSize,
    pageNumber,
  );

  products = filterProductsBySearchParams(products, url.searchParams);
  products = sortProducts(products, sortingType);
  return {
    products,
    query: searchQuery,
    sorting: sortingType,
    pageSize,
    pageNumber,
    pages,
  };
}

export async function categoryProductsLoader({ params, request }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const sortingType = url.searchParams.get("sort");
  const pageNumber = url.searchParams.get(FilterNames.PAGE) ?? 1;
  const pageSize = url.searchParams.get(FilterNames.PAGE_SIZE) ?? PAGE_SIZES[2];

  let { products, pages } = getPaginatedProducts(
    await getProductsByCategory(params.category, searchQuery),
    pageSize,
    pageNumber,
  );

  products = filterProductsBySearchParams(products, url.searchParams);
  products = sortProducts(products, sortingType);
  return {
    products,
    query: searchQuery,
    sorting: sortingType,
    pageSize,
    pageNumber,
    pages,
  };
}

const Products = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  const { products, query, sorting, pageNumber, pages, pageSize } =
    useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNavigating = Boolean(navigation.location);

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentParams = Object.fromEntries(searchParams.entries());
    const formData = new FormData(event.target);
    const formParams = Object.fromEntries(formData.entries());
    const mergedParams = { ...currentParams, ...formParams };
    const queryString = new URLSearchParams(mergedParams).toString();
    // Navigate to the new URL
    navigate(`${location.pathname}?${queryString}`);
  };

  useEffect(() => {
    document.getElementById("q").value = query ?? "";
  }, [query]);

  const handleSortingButtonClick = (sortingType) => {
    if (sorting !== sortingType)
      document.getElementById("sort-param").value = sortingType;
    else document.getElementById("sort-param").name = ""; //removes it
  };

  const handlePageSelect = ({ page }) => {
    if (page === pageNumber) return;
    else
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(FilterNames.PAGE, page);
        newParams.set(FilterNames.PAGE_SIZE, pageSize);
        return newParams;
      });
  };

  const handlePageSizeChange = (e) => {
    const value = e.target.value;
    if (value === pageSize) return;
    else
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(FilterNames.PAGE, 1);
        newParams.set(FilterNames.PAGE_SIZE, value);
        return newParams;
      });
  };

  return (
    <>
      <h2>Our Products</h2>
      <FilterBar>
        <Form data-testid="product-search" onSubmit={handleSubmit}>
          <input
            id="q"
            aria-label="Search products"
            placeholder="Search"
            type="search"
            name="q"
            defaultValue={query ?? ""}
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
          <span className="search-results">
            {products.length
              ? products.length === 1
                ? "1 result"
                : `${products.length} results`
              : "no results found"}
          </span>
        </Form>

        <Form
          data-testid="product-sort"
          className="product-sorting-form"
          onSubmit={handleSubmit}
        >
          <input type="hidden" id="sort-param" name="sort"></input>
          {Object.values(ProductSortingNames).map((value) => (
            <CheckmarkButton
              key={value}
              active={sorting === value}
              handleClick={() => handleSortingButtonClick(value)}
            >
              {camelCaseToWords(value)}
            </CheckmarkButton>
          ))}
        </Form>
      </FilterBar>

      {isNavigating ? (
        <LoadingSection>
          <LoadingSpinner></LoadingSpinner>
          <p>Loading products...</p>
        </LoadingSection>
      ) : products.length ? (
        <>
          <CardList data-testid="product list">
            {products.map((product) => (
              <li
                aria-label={product.title + " product"}
                role="link"
                tabIndex={0}
                key={product.id}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.target.matches("button, button *")
                    ? navigate("/products/" + product.id)
                    : true
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
          <section
            style={{
              fontSize: "1.1em",
              display: "flex",
              gap: "0.5em",
              alignItems: "baseline",
            }}
          >
            <span>Items per page:</span>
            <select defaultValue={pageSize} onChange={handlePageSizeChange}>
              {PAGE_SIZES.map((ps) => (
                <option key={"pageSize-" + ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </section>
          <Pagination
            page={+pageNumber}
            pages={+pages}
            handleChange={handlePageSelect}
          ></Pagination>
        </>
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

const LoadingSection = styled.section`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const FilterBar = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
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
  .product-sorting-form {
    display: flex;
    gap: 1em;
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
    margin-left: 1em;
    color: #666;
  }
`;

const PAGE_SIZES = [5, 10, 20];

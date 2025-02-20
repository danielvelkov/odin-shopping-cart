import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { mockProducts } from "../tests/mockProducts";
import CartProvider from "src/contexts/cartProvider";
import Products from "src/routes/products";
import Product from "src/routes/product";
import { createRoutesStub } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import {
  loader as productsLoader,
  categoryProductsLoader,
} from "../src/routes/products";
import { loader as productLoader } from "../src/routes/product";

// Mock API:
const server = setupServer(
  http.get("https://fakestoreapi.com/products", () => {
    return HttpResponse.json(mockProducts);
  }),
  http.get("https://fakestoreapi.com/products/:productId", (req) => {
    const { productId } = req.params;
    const product = mockProducts.find((x) => x.id === Number(productId));
    if (!product) throw new Error("No such product");
    return HttpResponse.json(product);
  }),
  http.get("https://fakestoreapi.com/products/category/:category", (req) => {
    const { category } = req.params;
    const products = mockProducts.filter((p) => p.category === category);
    if (!products) throw new Error("No products for category:" + category);
    return HttpResponse.json(products);
  }),
);

describe("Products page", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  const ProductsStub = createRoutesStub([
    {
      path: "/products",
      Component: () => (
        <CartProvider>
          <Products></Products>
        </CartProvider>
      ),
      loader: productsLoader,
    },
    {
      path: "/products/:productId",
      Component: () => (
        <CartProvider>
          <Product />
        </CartProvider>
      ),
      loader: productLoader,
    },
    {
      path: "/products/categories/:category",
      Component: () => (
        <CartProvider>
          <Products />
        </CartProvider>
      ),
      loader: categoryProductsLoader,
    },
  ]);

  test("Shows the available products", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    const productList = await screen.findByRole("list");
    const productItems =
      await within(productList).findAllByLabelText(/product/i);
    expect(productItems).toHaveLength(mockProducts.length);
  });

  test("Contains search bar for the products", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    expect(await screen.findByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test("Page shows 'no results for [SEARCH]' message when user searches for nonexisting products", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    const searchBar = await screen.findByPlaceholderText(/search/i);
    const user = userEvent.setup();
    await user.type(searchBar, "Supercalifragilisticexpialidocious{enter}");
    expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
  });

  test("Page shows only products that have a title with words matching the user search", async () => {
    const titleWords = mockProducts[0].title.split(" ");
    const keywords = titleWords.slice(0, Math.round(titleWords.length / 2));
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    const searchBar = await screen.findByPlaceholderText(/search/i);
    const user = userEvent.setup();
    await user.type(searchBar, `${keywords.join(" ")}{enter}`);
    expect(await screen.findByText(/1 result/i)).toBeInTheDocument();
    expect(await screen.findByText(mockProducts[0].title)).toBeInTheDocument();
    expect(screen.queryByText(mockProducts[1].title)).toBeNull();
  });

  test("When navigating from a selected category, only products within that category are shown", async () => {
    const productsPerCategoriesMap = mockProducts.reduce((map, p) => {
      map.set(p.category, (map.get(p.category) || 0) + 1);
      return map;
    }, new Map());

    const categoryWithMostProducts = [
      ...productsPerCategoriesMap.entries(),
    ].reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0];

    render(
      <ProductsStub
        initialEntries={[
          "/products/categories/" + encodeURI(categoryWithMostProducts),
        ]}
      ></ProductsStub>,
    );
    const productList = await screen.findByRole("list");
    const productItems =
      await within(productList).findAllByLabelText(/product/i);
    expect(productItems).toHaveLength(
      mockProducts.filter((p) => p.category === categoryWithMostProducts)
        .length,
    );
  });

  test('When navigating from an unknown category, "no results for" message is shown', async () => {
    render(
      <ProductsStub
        initialEntries={["/products/categories/loremupsumfoobar"]}
      ></ProductsStub>,
    );
    expect(await screen.findByText(/no results for/i)).toBeInTheDocument();
  });

  // i don't think this is a unit test. More like an integration test. Also how can you tell if its on the
  // product page. This is bull
  test("Clicking on a product navigates to that product's page", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    const user = userEvent.setup();
    const productHeading = await screen.findByRole("heading", {
      name: mockProducts[0].title,
    });
    await user.click(productHeading);

    expect(
      await screen.findByRole("heading", {
        name: mockProducts[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("paragraph", {
        value: mockProducts[0].description,
      }),
    ).toBeInTheDocument();
  });
});

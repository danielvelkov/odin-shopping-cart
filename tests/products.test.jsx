import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockProducts } from "../tests/mockProducts";
import CartProvider from "src/contexts/cartProvider";
import Products from "src/routes/products";
import Product from "src/routes/product";
import { createRoutesStub } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Products page", () => {
  const ProductsStub = createRoutesStub([
    {
      path: "/products",
      Component: () => (
        <CartProvider>
          <Products></Products>
        </CartProvider>
      ),
      loader: () => ({ products: mockProducts }),
    },
    {
      path: "/products/:productId",
      Component: () => (
        <CartProvider>
          <Product />
        </CartProvider>
      ),
      loader: ({ params }) => ({
        product: mockProducts.find((x) => x.id === Number(params.productId)),
      }),
    },
  ]);

  test("Shows the available products", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    const productItems = await screen.findAllByRole("listitem");
    expect(productItems).toHaveLength(mockProducts.length);
  });

  test("Contains search bar for the products", async () => {
    render(<ProductsStub initialEntries={["/products"]}></ProductsStub>);
    expect(await screen.findByRole("search")).toBeInTheDocument();
  });

  // i don't think this is a unit test. More like an integration test. Also how can you tell if its on the
  // product page
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

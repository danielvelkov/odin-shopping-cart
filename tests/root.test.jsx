import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Root from "../src/routes/root";
import { createRoutesStub } from "react-router-dom";
import CartProvider from "../src/contexts/cartProvider";

const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => (
      <CartProvider>
        <Root></Root>
      </CartProvider>
    ),
  },
]);

describe("Root page", () => {
  test("Shows page name", () => {
    render(<Stub></Stub>);
    expect(screen.getByRole("heading", { name: "MockShop" })).toBeInTheDocument;
  });
  test("Displays Home link", () => {
    render(<Stub></Stub>);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument;
  });
  test("Displays Products link", () => {
    render(<Stub></Stub>);
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument;
  });
});

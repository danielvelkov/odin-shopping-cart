import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Root from "../src/routes/root";
import { BrowserRouter } from "react-router-dom";
import CartProvider from "src/contexts/cartProvider";

const customRender = (ui, renderOptions) => {
  return render(
    <CartProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </CartProvider>,
    renderOptions,
  );
};

describe("Root page", () => {
  test("Shows page name", () => {
    customRender(<Root></Root>);
    expect(screen.getByRole("heading", { name: "MockShop" })).toBeInTheDocument;
  });
  test("Displays Home link", () => {
    customRender(<Root></Root>);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument;
  });
  test("Displays Products link", () => {
    customRender(<Root></Root>);
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument;
  });
});

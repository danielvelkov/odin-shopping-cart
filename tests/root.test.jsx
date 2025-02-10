import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Root from "../src/routes/root";
import { BrowserRouter } from "react-router-dom";

describe("Root page", () => {
  test("Shows page name", () => {
    render(<Root></Root>, { wrapper: BrowserRouter });
    expect(screen.getByRole("heading", { name: "MockShop" })).toBeInTheDocument;
  });
  test("Displays Home link", () => {
    render(<Root></Root>, { wrapper: BrowserRouter });
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument;
  });
  test("Displays Products link", () => {
    render(<Root></Root>, { wrapper: BrowserRouter });
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument;
  });
});

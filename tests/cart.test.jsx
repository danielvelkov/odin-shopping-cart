import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import Cart from "/src/routes/cart";
import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router-dom";
import CartProvider from "../src/contexts/cartProvider";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { mockProducts } from "./mockProducts";
import userEvent from "@testing-library/user-event";
import { USDollar } from "../src/utils/priceFormatter";

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
);

describe("Cart page", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderCartWithInitialState = (initialState) => {
    render(
      <CartProvider value={initialState}>
        <CartStub initialEntries={["/cart"]}></CartStub>
      </CartProvider>,
    );
  };

  const getCartTableAndRows = async () => {
    const table = await screen.findByRole("table");
    const rows = await within(table).findAllByRole("row");
    return { table, rows };
  };

  const CartStub = createRoutesStub([
    {
      path: "/cart",
      Component: Cart,
    },
  ]);

  test('Shows "empty cart" placeholder message when no cart items are added', async () => {
    renderCartWithInitialState();
    expect(
      await screen.findByRole("heading", { name: /cart.*empty/ }),
    ).toBeInTheDocument();
  });

  test("Shows cart items table when cart is not empty ", async () => {
    renderCartWithInitialState(
      new Map().set(mockProducts[0].id, { quantity: 2 }),
    );
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: mockProducts[0].title }),
    ).toBeInTheDocument();
  });

  test("Shows number of unique products in cart ", () => {
    renderCartWithInitialState(
      new Map()
        .set(mockProducts[0].id, { quantity: 2 })
        .set(mockProducts[1].id, { quantity: 1 }),
    );
    expect(screen.getByText("2 items")).toBeInTheDocument();
  });

  test("Cart item quantity is reflected in the table row ", async () => {
    let expectedQuantity = 532904;
    renderCartWithInitialState(
      new Map().set(mockProducts[0].id, {
        quantity: expectedQuantity,
      }),
    );
    expect(
      await screen.findByDisplayValue(expectedQuantity),
    ).toBeInTheDocument();
  });

  test("Subtotal for item changes when input quantity changes", async () => {
    let product = mockProducts[0];
    let quantity = 2;
    let startingSubtotal = quantity * product.price;
    let expectedSubtotal = (quantity + 1) * product.price;

    renderCartWithInitialState(new Map().set(product.id, { quantity }));
    const user = userEvent.setup();

    const { rows } = await getCartTableAndRows();

    // Assuming the first row is the header, get the second row of the cart item
    const row = rows[1];

    expect(
      within(row).getByText(startingSubtotal, { exact: false }),
    ).toBeInTheDocument();

    // Test '+' quantity increase
    const addQuantityButton = within(row).getByRole("button", { name: "+" });
    await user.click(addQuantityButton);

    expect(
      within(row).getByText(expectedSubtotal, { exact: false }),
    ).toBeInTheDocument();

    // Test '-' quantity decrease
    const decreaseQuantityButton = within(row).getByRole("button", {
      name: "-",
    });
    await user.click(decreaseQuantityButton);

    expect(
      within(row).getByText(startingSubtotal, { exact: false }),
    ).toBeInTheDocument();
  });

  test("Total for cart changes when cart item quantity changes", async () => {
    let products = [mockProducts[0], mockProducts[1]];
    let quantity = 2;
    let newQuantity = 3;
    let startingTotal = USDollar.format(
      products.reduce((sum, cur) => sum + cur.price * quantity, 0),
    );
    let expectedTotal = USDollar.format(
      products.reduce((sum, cur) => sum + cur.price * newQuantity, 0),
    );

    renderCartWithInitialState(
      new Map()
        .set(products[0].id, { quantity })
        .set(products[1].id, { quantity }),
    );
    const user = userEvent.setup();

    const { table, rows } = await getCartTableAndRows();
    const firstRow = rows[1];
    const secondRow = rows[2];

    expect(
      within(table).getByText(startingTotal, { exact: false }),
    ).toBeInTheDocument();

    let addQuantityButton = within(firstRow).getByRole("button", { name: "+" });
    await user.click(addQuantityButton);

    addQuantityButton = within(secondRow).getByRole("button", { name: "+" });
    await user.click(addQuantityButton);

    expect(
      await within(table).findByText(expectedTotal, { exact: false }),
    ).toBeInTheDocument();
  });

  test('Clicking "Remove" on a cart item removes it from the table', async () => {
    renderCartWithInitialState(
      new Map()
        .set(mockProducts[0].id, { quantity: 2 })
        .set(mockProducts[1].id, { quantity: 1 }),
    );
    const user = userEvent.setup();

    const { rows } = await getCartTableAndRows();
    // Assuming the first row is the header, get the second row of the cart item
    const firstCartItem = rows[1];
    const secondCartItem = rows[2];

    const removeButton = within(firstCartItem).getByRole("button", {
      name: /remove/i,
    });
    await user.click(removeButton);

    expect(firstCartItem).not.toBeInTheDocument();
    expect(secondCartItem).toBeInTheDocument();
  });
});

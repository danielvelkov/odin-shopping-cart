import { createMemoryRouter } from "react-router";
import {
  afterAll,
  beforeAll,
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  vi,
} from "vitest";
import { render, screen, waitFor, within } from "./test.utils";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { mockProducts } from "./mockProducts";
import ProductFilters from "../src/routes/productFilters";
import Products, { loader as productsLoader } from "../src/routes/products";
import { ProductSortingNames } from "../src/constants/productSortingNames";
import { camelCaseToWords } from "../src/utils/stringCaseConverter";

//////////////////// TAKE NOTE ////////////////////
// Why mock the useDebounce hook?
// Because none of the tests work even with added delay.
// Its like the called method does not exist.
// No idea why! So I mock it ¯\_( ͡° ͜ʖ ͡°)_/¯
vi.mock("../src/hooks/useDebounce", () => ({
  default: (callback) => callback,
}));

const API_BASE_URL = "https://fakestoreapi.com";

const server = setupServer(
  http.get(`${API_BASE_URL}/products`, () => {
    return HttpResponse.json(mockProducts);
  }),
);

describe("Product sorting functionality", () => {
  let user;
  let router;
  const routes = [
    {
      path: "/",
      element: (
        <>
          <ProductFilters></ProductFilters>
          <Products></Products>
        </>
      ),
      loader: productsLoader,
    },
  ];

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  beforeEach(async () => {
    router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(document.body).not.toBeEmptyDOMElement();
    });
    user = userEvent.setup();
  });

  const getDisplayedProducts = async () => {
    const productList = await screen.findByTestId("product list");

    if (productList) {
      const products = await within(productList).findAllByLabelText(/product/i);
      if (products.length > 0) {
        return products;
      }
    }

    const noResultsMessage = await screen.findByText(/no results for/i);
    if (noResultsMessage) {
      return [];
    }

    throw new Error("Testing product filtering failed: getDisplayedProducts()");
  };

  const selectSortingButton = async (regExp) => {
    const sortingButton = await screen.findByRole("button", { name: regExp });
    await user.click(sortingButton);
    return sortingButton;
  };

  test.each([
    camelCaseToWords(ProductSortingNames.BY_PRICE),
    camelCaseToWords(ProductSortingNames.BY_PRICE_ASCENDING),
    camelCaseToWords(ProductSortingNames.BY_RATING),
    camelCaseToWords(ProductSortingNames.BY_RATING_ASCENDING),
  ])(
    "only `%s` sorting button has a check icon when selected",
    async (sortButtonName) => {
      const sortingButtonsForm = await screen.findByTestId("product-sort");
      const sortingButtons = within(sortingButtonsForm).getAllByRole("button");

      // click sorting button
      const sortButton = await selectSortingButton(
        new RegExp(sortButtonName, "i"),
      );

      // contains checkmark icon
      expect(
        await within(sortButton).findByLabelText(/check/),
      ).toBeInTheDocument();
      let sortingButtonsExceptSelected = sortingButtons.filter(
        (b) => !b.textContent.includes(sortButtonName),
      );
      // others do not contain icon
      sortingButtonsExceptSelected.forEach(async (sb) => {
        expect(
          await within(sb).findByLabelText(/check/),
        ).not.toBeInTheDocument();
      });
    },
  );

  test.each([
    [
      camelCaseToWords(ProductSortingNames.BY_PRICE),
      (p1, p2) => {
        return p2.price - p1.price;
      },
    ],
    [
      camelCaseToWords(ProductSortingNames.BY_PRICE_ASCENDING),
      (p1, p2) => {
        return p1.price - p2.price;
      },
    ],
    [
      camelCaseToWords(ProductSortingNames.BY_RATING),
      (p1, p2) => {
        return p2.rating.rate - p1.rating.rate;
      },
    ],
    [
      camelCaseToWords(ProductSortingNames.BY_RATING_ASCENDING),
      (p1, p2) => {
        return p1.rating.rate - p2.rating.rate;
      },
    ],
  ])(
    'Sorts products correctly when pressing "%s" button',
    async (sortButtonName, sortingFunc) => {
      const clonedProducts = JSON.parse(JSON.stringify(mockProducts));
      const sortedProducts = clonedProducts.sort(sortingFunc);

      await selectSortingButton(new RegExp(sortButtonName, "i"));

      const productItems = await getDisplayedProducts();
      expect(productItems.length).toBe(sortedProducts.length);
      for (let i = 0; i < productItems.length; i++) {
        const priceText = (
          await within(productItems[i]).findByLabelText(/price\(USD\)/i)
        ).textContent;
        const numericPrice = parseFloat(priceText.replace(/[^\d.-]/g, ""));

        expect(numericPrice).toBe(sortedProducts[i].price);
      }
    },
  );
});

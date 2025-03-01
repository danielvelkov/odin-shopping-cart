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

describe("Product filtering functionality", () => {
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
    try {
      let productList;
      productList = await screen.findByTestId("product list");
      return await within(productList).findAllByLabelText(/product/i);
    } catch (error) {
      console.error(error);
      const noResultsMessage = await screen.findByText(/no results for/i);
      if (noResultsMessage) return [];
      throw new Error(
        "Testing product filtering failed: getDisplayedProducts()",
      );
    }
  };

  describe("Price Range Filter", () => {
    const setMinPrice = async (price) => {
      const minInput = await screen.findByRole("spinbutton", { name: /min/i });
      await user.clear(minInput);
      await user.type(minInput, price.toString());
      return minInput;
    };

    const setMaxPrice = async (price) => {
      const maxInput = await screen.findByRole("spinbutton", { name: /max/i });
      await user.clear(maxInput);
      await user.type(maxInput, price.toString());
      return maxInput;
    };

    const applyPriceFilter = async () => {
      const submitSearch = await screen.findByRole("button", {
        name: /price range/i,
      });
      await user.click(submitSearch);
    };

    test("should display price range label with min and max inputs", async () => {
      expect(await screen.findByLabelText(/^price range/i)).toBeInTheDocument();
      expect(
        await screen.findByRole("spinbutton", { name: /min/i }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("spinbutton", { name: /max/i }),
      ).toBeInTheDocument();
    });

    test.each([
      [30, 500],
      [1, 20],
      [50, 100],
    ])(
      "filters products correctly for values: [min:(%i), max:(%i)]",
      async (MIN_PRICE, MAX_PRICE) => {
        const expectedCount = mockProducts.filter(
          (p) => p.price > MIN_PRICE && p.price < MAX_PRICE,
        ).length;
        const minInput = await setMinPrice(MIN_PRICE);
        expect(minInput.value).toBe(MIN_PRICE.toString());

        const maxInput = await setMaxPrice(MAX_PRICE);
        expect(maxInput.value).toBe(MAX_PRICE.toString());

        await applyPriceFilter();

        const productItems = await getDisplayedProducts();
        expect(productItems.length).toBe(expectedCount);
      },
    );

    test.each([
      [99999, 1],
      [1000, 500],
      [999999, 100],
    ])(
      "should display validation message for invalid values: [min:(%s), max:(%s)]",
      async (MIN_PRICE, MAX_PRICE) => {
        const minInput = await setMinPrice(MIN_PRICE);
        const maxInput = await setMaxPrice(MAX_PRICE);
        await waitFor(() => expect(minInput).toBeInvalid());
        await waitFor(() => expect(maxInput).toBeInvalid());
      },
    );

    test("should not filter products by price when price filter is disabled", async () => {
      const MIN_PRICE = 30;

      await setMinPrice(MIN_PRICE);
      await applyPriceFilter();

      let productItems = await getDisplayedProducts();
      const filteredCount = productItems.length;
      expect(filteredCount).toBeLessThan(mockProducts.length);

      const checkbox = await screen.findByRole("checkbox", { name: /price/i });
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();

      productItems = await getDisplayedProducts();
      expect(productItems.length).toBe(mockProducts.length);
    });
  });
  describe("Star Rating filter", () => {
    const toggleRatingFilter = async () => {
      const starRatingCheckbox = await screen.findByRole("checkbox", {
        name: /filter by star rating/i,
      });
      await user.click(starRatingCheckbox);
      expect(starRatingCheckbox).toBeChecked();
    };

    const selectRatingOption = async (rating) => {
      const options = screen.getAllByRole("radio", {
        name: /Star Rating/i,
      });
      await user.click(options[rating]);
      expect(options[rating]).toBeChecked();
    };

    test("Displays rating options list. Any rating & 1-5 stars as options", async () => {
      const ratingFilterHeading =
        await screen.findByLabelText(/filter.*star rating/i);
      const options = await screen.findAllByRole("radio", {
        name: /Star Rating/i,
      });

      expect(ratingFilterHeading).toBeInTheDocument();
      expect(options.length).toBe(6);
    });

    test.each([1, 2, 3, 4, 5])(
      "filters products correctly for values: [Star Rating +%d]",
      async (rating) => {
        const expectedCount = mockProducts.filter(
          (p) => p.rating.rate >= rating,
        ).length;

        await toggleRatingFilter();
        await selectRatingOption(rating);

        const productItems = await getDisplayedProducts();
        expect(productItems.length).toBe(expectedCount);
      },
    );
  });
});

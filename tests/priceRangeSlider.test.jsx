import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import PriceRangeSlider from "../src/components/priceRangeSlider";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

function noop() {}

describe("Price Range Slider", () => {
  let user;
  let router;
  const sliderMinimum = 1;
  const sliderMaximum = 10000;

  const startingMinimum = 100;
  const startingMaximum = 5000;

  const routes = [
    {
      path: "/",
      element: (
        <PriceRangeSlider
          min={sliderMinimum}
          max={sliderMaximum}
          minPrice={startingMinimum}
          maxPrice={startingMaximum}
          handleChange={noop}
        />
      ),
    },
  ];

  beforeEach(() => {
    router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);
    user = userEvent.setup();
  });
  afterEach(() => cleanup());

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
      name: /filter by price/i,
    });
    await user.click(submitSearch);
  };

  test("Slider starts with its provided min and max values for prices", async () => {
    const minSlider = await screen.findByRole("slider", {
      name: "slider left thumb",
    });
    const maxSlider = await screen.findByRole("slider", {
      name: "slider right thumb",
    });

    expect(minSlider.value).toBe(startingMinimum.toString());
    expect(maxSlider.value).toBe(startingMaximum.toString());
  });

  test("Slider has input fields reflecting the slider values", () => {
    const minSpinButton = screen.getByRole("spinbutton", { name: /min/i });
    const maxSpinButton = screen.getByRole("spinbutton", { name: /max/i });

    expect(minSpinButton.value).toBe(startingMinimum.toString());
    expect(maxSpinButton.value).toBe(startingMaximum.toString());
  });

  test.each([
    [10, 700],
    [1, 20],
    [50, 100],
  ])(
    "changing the fields updates the slider [min: %i , max: %i]",
    async (minInput, maxInput) => {
      const minSpinButton = await setMinPrice(minInput);
      const maxSpinButton = await setMaxPrice(maxInput);

      await applyPriceFilter();

      const minSlider = await screen.findByRole("slider", {
        name: "slider left thumb",
      });
      const maxSlider = await screen.findByRole("slider", {
        name: "slider right thumb",
      });

      expect(minSlider.value).toBe(minSpinButton.value);
      expect(maxSlider.value).toBe(maxSpinButton.value);
    },
  );
});

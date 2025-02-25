import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import PriceRangeSlider from "../src/components/priceRangeSlider";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

function noop() {}

describe("Price Range Slider", () => {
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

  const router = createMemoryRouter(routes, { initialEntries: ["/"] });
  test("Slider starts with its provided min and max values for prices", () => {
    render(<RouterProvider router={router} />);
    const minSlider = screen.getByRole("slider", { name: "slider left thumb" });
    const maxSlider = screen.getByRole("slider", {
      name: "slider right thumb",
    });

    expect(minSlider.value).toBe(startingMinimum.toString());
    expect(maxSlider.value).toBe(startingMaximum.toString());
  });

  test("Slider has input fields reflecting the slider values", () => {
    render(<RouterProvider router={router} />);
    const minSpinButton = screen.getByRole("spinbutton", { name: /min/i });
    const maxSpinButton = screen.getByRole("spinbutton", { name: /max/i });

    expect(minSpinButton.value).toBe(startingMinimum.toString());
    expect(maxSpinButton.value).toBe(startingMaximum.toString());
  });

  test(`entered min value defaults to the max value minus 1, if it's bigger than the max value`, async () => {
    render(<RouterProvider router={router} />);
    const minSpinButton = screen.getByRole("spinbutton", { name: /min/i });

    const user = userEvent.setup();
    await user.type(minSpinButton, `999999`);

    expect(minSpinButton.value).toBe((startingMaximum - 1).toString());
  });

  test(`entered max value defaults to the min value plus 1, if cleared`, async () => {
    render(<RouterProvider router={router} />);
    const maxSpinButton = screen.getByRole("spinbutton", { name: /max/i });

    const user = userEvent.setup();
    await user.clear(maxSpinButton);
    expect(maxSpinButton.value).toBe((startingMinimum + 1).toString());
  });
});

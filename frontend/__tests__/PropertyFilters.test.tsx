/* eslint-disable */
// @ts-nocheck

import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "../components/PropertyFilters";

describe("PropertyFilters", () => {
  test("submitting sends cleaned filters", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getByText("City:").nextSibling;

    fireEvent.change(cityInput, {
      target: { value: "San Diego" }
    });

    fireEvent.submit(screen.getByTestId("filters-form"));

    expect(onSearch).toHaveBeenCalledWith({ city: "San Diego" });
  });

  test("clear button resets form and calls onSearch({})", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getByText("City:").nextSibling;

    fireEvent.change(cityInput, {
      target: { value: "San Diego" }
    });

    fireEvent.click(screen.getByText("Clear"));

    expect(cityInput.value).toBe("");
    expect(onSearch).toHaveBeenCalledWith({});
  });

  test("multiple filters combine correctly", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getByText("City:").nextSibling;
    const maxPriceInput = screen.getByText("Max Price:").nextSibling;

    fireEvent.change(cityInput, {
      target: { value: "San Diego" }
    });

    fireEvent.change(maxPriceInput, {
      target: { value: "1000000" }
    });

    fireEvent.submit(screen.getByTestId("filters-form"));

    expect(onSearch).toHaveBeenCalledWith({
      city: "San Diego",
      maxPrice: "1000000"
    });
  });
});

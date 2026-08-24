/* eslint-disable */
// @ts-nocheck

import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "../src/components/PropertyFilters";

describe("PropertyFilters", () => {
  test("submitting sends cleaned filters", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getAllByRole("textbox")[0];

    fireEvent.change(cityInput, { target: { value: "San Diego" } });

    fireEvent.submit(screen.getByTestId("filters-form"));

    expect(onSearch).toHaveBeenCalledWith({ city: "San Diego" });
  });

  test("clear button resets form and calls onSearch({})", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getAllByRole("textbox")[0];

    fireEvent.change(cityInput, { target: { value: "San Diego" } });

    fireEvent.click(screen.getByText("Clear"));

    expect(cityInput.value).toBe("");
    expect(onSearch).toHaveBeenCalledWith({});
  });

  test("multiple filters combine correctly", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const cityInput = screen.getAllByRole("textbox")[0];
    const minPriceInput = screen.getAllByRole("spinbutton")[0];
    const maxPriceInput = screen.getAllByRole("spinbutton")[1];

    fireEvent.change(cityInput, { target: { value: "San Diego" } });
    fireEvent.change(maxPriceInput, { target: { value: "1000000" } });

    fireEvent.submit(screen.getByTestId("filters-form"));

    expect(onSearch).toHaveBeenCalledWith({
      city: "San Diego",
      maxPrice: "1000000",
    });
  });

  test("submits all supported filter controls", () => {
    const onSearch = jest.fn();

    render(<PropertyFilters onSearch={onSearch} />);

    const textboxes = screen.getAllByRole("textbox");
    const spinbuttons = screen.getAllByRole("spinbutton");
    const selects = screen.getAllByRole("combobox");

    fireEvent.change(textboxes[0], { target: { value: "Austin" } });
    fireEvent.change(textboxes[1], { target: { value: "78701" } });
    fireEvent.change(spinbuttons[0], { target: { value: "250000" } });
    fireEvent.change(spinbuttons[1], { target: { value: "750000" } });
    fireEvent.change(selects[0], { target: { value: "3" } });
    fireEvent.change(selects[1], { target: { value: "2" } });
    fireEvent.submit(screen.getByTestId("filters-form"));

    expect(onSearch).toHaveBeenCalledWith({
      city: "Austin",
      zipcode: "78701",
      minPrice: "250000",
      maxPrice: "750000",
      beds: "3",
      baths: "2",
    });
  });
});

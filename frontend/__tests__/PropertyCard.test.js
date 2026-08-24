/* eslint-disable */
// @ts-nocheck

import { render, screen, fireEvent } from "@testing-library/react";
import PropertyCard from "../src/components/PropertyCard";
describe("PropertyCard", () => {
  const property = {
    L_ListingID: "123",
    L_Photos: "",
    L_SystemPrice: 500000,
    L_Address: "123 Test St",
    L_City: "Testville",
    L_State: "CA",
    L_Keyword2: 3,
    LM_Dec_3: 2,
    LM_Int2_3: 1500
  };

  test("renders property data", () => {
    render(<PropertyCard property={property} />);

    expect(screen.getByText("123 Test St")).toBeInTheDocument();
    expect(screen.getByText("$500,000")).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("3 beds"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("2 baths"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("1500 sqft"))).toBeInTheDocument();
  });

  test("clicking navigates to detail page", () => {
    render(<PropertyCard property={property} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/property/123");
  });

  test("renders the first photo when the photo JSON is valid", () => {
    render(
      <PropertyCard
        property={{ ...property, L_Photos: JSON.stringify(["first.jpg", "second.jpg"]) }}
      />
    );

    expect(screen.getByRole("img", { name: "Property photo" })).toHaveAttribute(
      "src",
      "first.jpg"
    );
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  test("uses the no-photo state for malformed and empty photo JSON", () => {
    const { rerender } = render(
      <PropertyCard property={{ ...property, L_Photos: "not-json" }} />
    );
    expect(screen.getByText("No photo available")).toBeInTheDocument();

    rerender(<PropertyCard property={{ ...property, L_Photos: "[]" }} />);
    expect(screen.getByText("No photo available")).toBeInTheDocument();
  });
});

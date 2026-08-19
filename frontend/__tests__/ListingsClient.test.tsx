/* eslint-disable */
// @ts-nocheck

import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListingsClient from "../src/components/ListingsClient";

beforeAll(() => {
  window.scrollTo = jest.fn();
});

// Mock fetchAPIClient
jest.mock("../lib/fetchAPIClient", () => ({
  fetchAPIClient: jest.fn().mockResolvedValue({
    results: Array.from({ length: 20 }, (_, i) => ({
      L_ListingID: `${i}`,
      L_Photos: "",
      L_SystemPrice: 100000,
      L_Address: "123 Test St",
      L_City: "Testville",
      L_State: "CA",
      L_Keyword2: 3,
      LM_Dec_3: 2,
      LM_Int2_3: 1500
    })),
    total: 57
  })
}));

describe("ListingsClient", () => {
  test("pagination appears below property grid", async () => {
    await act(async () => {
      render(<ListingsClient />);
    });

    const nextButton = await screen.findByText("Next");
    const cards = await screen.findAllByTestId("property-card");

    expect(cards[cards.length - 1].compareDocumentPosition(nextButton))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test("results summary shows correct X–Y of Z", async () => {
    await act(async () => {
      render(<ListingsClient />);
    });

    const summary = await screen.findByText((_, node) => {
      const text = node.textContent;
      return node.tagName === "H2" &&
             text?.includes("Showing") &&
             text.includes("1") &&
             text.includes("20") &&
             text.includes("57");
    });

    expect(summary).toBeInTheDocument();
  });

  test("changing page updates summary", async () => {
    await act(async () => {
      render(<ListingsClient />);
    });

    fireEvent.click(await screen.findByText("Next"));

    const summary = await screen.findByText((_, node) => {
      const text = node.textContent;
      return node.tagName === "H2" &&
             text?.includes("Showing") &&
             text.includes("21") &&
             text.includes("40") &&
             text.includes("57");
    });

    expect(summary).toBeInTheDocument();
  });

  test("filters reset pagination to page 1", async () => {
    await act(async () => {
      render(<ListingsClient />);
    });

    fireEvent.click(screen.getByText("Next")); // go to page 2

    fireEvent.submit(screen.getByTestId("filters-form")); // apply filters

    const summary = await screen.findByText((_, node) => {
      const text = node.textContent;
      return node.tagName === "H2" &&
             text?.includes("Showing") &&
             text.includes("1") &&
             text.includes("20") &&
             text.includes("57");
    });

    expect(summary).toBeInTheDocument();
  });
});

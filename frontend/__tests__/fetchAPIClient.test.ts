/* eslint-disable */
// @ts-nocheck

import { fetchAPIClient } from "../lib/fetchAPIClient";

describe("fetchProperties API client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("fetches properties with filters", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({
        results: [{ L_ListingID: "123" }],
        total: 1
      })
    });

    const data = await fetchAPIClient({ city: "San Diego" });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/properties?city=San+Diego"
    );

    expect(data.results).toEqual([{ L_ListingID: "123" }]);
    expect(data.total).toBe(1);
  });

  test("does not send empty filters", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ results: [], total: 0 })
    });

    const data = await fetchAPIClient({});

    expect(global.fetch).toHaveBeenCalledWith("/api/properties?");
    expect(data.results).toEqual([]);
    expect(data.total).toBe(0);
  });

  test("handles fetch errors", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    try {
      await fetchAPIClient({ city: "San Diego" });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});

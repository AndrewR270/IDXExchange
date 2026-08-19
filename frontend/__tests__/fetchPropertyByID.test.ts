/* eslint-disable */
// @ts-nocheck

import { fetchPropertyByID } from "../src/api/fetchAPIClient";

describe("fetchPropertyByID", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches a property by id from the backend API", async () => {
    const property = { L_ListingID: "1118422731", L_Address: "1461 Laurel Way" };
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => property,
    });

    const data = await fetchPropertyByID("1118422731");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/getProperty?id=1118422731"
    );
    expect(data).toEqual(property);
  });
});

const request = require("supertest");
const app = require("../app");
const pool = require("../db");

jest.mock("../db");

describe("GET /api/properties", () => {

  beforeEach(() => {
    pool.query.mockReset();
  });

  test("returns filtered results", async () => {
    pool.query.mockResolvedValueOnce([[{ L_ListingID: "123" }]]); // rows
    pool.query.mockResolvedValueOnce([[{ total: 1 }]]); // count

    const res = await request(app)
      .get("/api/properties?city=%20San%20Diego%20&zipcode=92101&minPrice=100000&maxPrice=900000&beds=2&baths=1&limit=20&offset=0");

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.total).toBe(1);
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query.mock.calls[0][1]).toEqual([
      " San Diego ",
      "92101",
      "100000",
      "900000",
      "2",
      "1",
      20,
      0,
    ]);
  });

  test("uses default pagination values", async () => {
    pool.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([[{ total: 0 }]]);

    const res = await request(app).get("/api/properties");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ total: 0, limit: 20, offset: 0, results: [] });
  });

  test("rejects non-string string filters", async () => {
    const res = await request(app).get("/api/properties?city=one&city=two");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/city must be a string/);
  });

  test("rejects invalid numeric filters", async () => {
    const res = await request(app)
      .get("/api/properties?minPrice=abc");

    expect(res.status).toBe(400);
  });

  test("supports ordered whitelisted sorting", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockResolvedValueOnce([[{ total: 1 }]]);

    const res = await request(app).get(
      "/api/properties?sortBy[1]=LM_Int2_3&sortBy[0]=L_SystemPrice&sortOrder[1]=asc&sortOrder[0]=desc"
    );

    expect(res.status).toBe(200);
    expect(pool.query.mock.calls[0][0]).toContain(
      "ORDER BY L_SystemPrice DESC, LM_Int2_3 ASC"
    );
  });

  test("rejects a non-whitelisted sort field", async () => {
    const res = await request(app).get(
      "/api/properties?sortBy[0]=L_Address&sortOrder[0]=asc"
    );

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid sort field/);
  });

  test("returns a server error when the database query fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("database unavailable"));

    const res = await request(app).get("/api/properties");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "database unavailable" });
  });
});

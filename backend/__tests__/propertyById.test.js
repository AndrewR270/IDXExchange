const request = require("supertest");
const app = require("../app");
const pool = require("../db");

jest.mock("../db");

describe("GET /api/properties/:id", () => {

  beforeEach(() => {
    pool.query.mockReset();
  });

  test("returns property", async () => {
    pool.query.mockResolvedValueOnce([[{ L_ListingID: "123" }]]);

    const res = await request(app).get("/api/properties/123");

    expect(res.status).toBe(200);
    expect(res.body.L_ListingID).toBe("123");
  });

  test("404 when not found", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/properties/999");

    expect(res.status).toBe(404);
  });

  test("400 invalid ID", async () => {
    const res = await request(app).get("/api/properties/@@@");
    expect(res.status).toBe(400);
  });

  test("400 when the ID is longer than 20 characters", async () => {
    const res = await request(app).get("/api/properties/123456789012345678901");

    expect(res.status).toBe(400);
  });

  test("500 when the property query fails", async () => {
    pool.query.mockRejectedValueOnce(new Error("database unavailable"));

    const res = await request(app).get("/api/properties/123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "database unavailable" });
  });
});

describe("GET /api/properties/:id/openhouses", () => {

  test("returns open houses", async () => {
    pool.query
      .mockResolvedValueOnce([[1]]) // property exists
      .mockResolvedValueOnce([[{ OH_StartDate: "2024-01-01" }]]);

    const res = await request(app).get("/api/properties/123/openhouses");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("returns empty array when property does not exist", async () => {
    pool.query.mockResolvedValueOnce([[]]); // property missing

    const res = await request(app).get("/api/properties/123/openhouses");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("400 invalid ID", async () => {
    const res = await request(app).get("/api/properties/@@@/openhouses");
    expect(res.status).toBe(400);
  });

  test("500 when the open-house query fails", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockRejectedValueOnce(new Error("database unavailable"));

    const res = await request(app).get("/api/properties/123/openhouses");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "database unavailable" });
  });
});

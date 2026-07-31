/* eslint-disable */
// @ts-nocheck

import { generatePageNumbers } from "../utils/generatePageNumbers";

describe("generatePageNumbers", () => {
  test("no ellipsis when total <= 7", () => {
    expect(generatePageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test("near start", () => {
    expect(generatePageNumbers(2, 24)).toEqual([1, 2, 3, "...", 24]);
  });

  test("middle range", () => {
    expect(generatePageNumbers(10, 24)).toEqual([1, "...", 9, 10, 11, "...", 24]);
  });

  test("near end", () => {
    expect(generatePageNumbers(23, 24)).toEqual([1, "...", 22, 23, 24]);
  });

  // 🐛 Debug Challenge
  test("does not duplicate last page", () => {
    const pages = generatePageNumbers(23, 24);
    expect(pages.filter(p => p === 24).length).toBe(1);
  });
});

/* eslint-disable */
// @ts-nocheck

import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/Pagination";

describe("Pagination Component", () => {
  test("hidden when totalPages <= 1", () => {
    render(<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />);
    expect(screen.queryByText("Next")).toBeNull();
    expect(screen.queryByText("Previous")).toBeNull();
  });

  test("Previous disabled on first page", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  test("Next disabled on last page", () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("Next")).toBeDisabled();
    expect(screen.getByText("Previous")).not.toBeDisabled();
  });

  test("clicking a page number triggers onPageChange", () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test("ellipsis appear for large page counts", () => {
    render(<Pagination currentPage={5} totalPages={24} onPageChange={() => {}} />);

    expect(screen.getAllByText("...").length).toBe(2);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
  });

  test("scrolls to top on page change", () => {
    window.scrollTo = jest.fn();
    const onPageChange = jest.fn();

    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText("Next"));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

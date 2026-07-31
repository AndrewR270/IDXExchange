import { generatePageNumbers } from "../utils/generatePageNumbers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function goTo(page: number) {
    window.scrollTo(0, 0);
    onPageChange(page);
  }

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="pagination flex justify-center gap-3 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
      >
        Previous
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i}>...</span>
        ) : (
          <button
            key={i}
            className={`px-3 py-1 rounded-md border ${
              p === currentPage ? "primary-button" : "secondary-button"
            }`}
            onClick={() => goTo(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

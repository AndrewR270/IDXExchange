export function generatePageNumbers(current: number, total: number): (number | string)[] {
  // If there are 7 or fewer pages, show all of them with no ellipses.
  // This avoids unnecessary truncation on small datasets.
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  // Always show the first page.
  pages.push(1);

  // Show a leading ellipsis when the current page is far enough from the start.
  // Example: current = 10 → "1 … 9 10 11 … 20"
  if (current > 3) pages.push("...");

  // Determine the sliding window around the current page.
  // We show at most: current - 1, current, current + 1.
  // Clamp the window so it never overlaps the first or last page.
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  // Add the window pages.
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  // Show a trailing ellipsis when the current page is far enough from the end.
  if (current < total - 2) pages.push("...");

  // Always show the last page.
  pages.push(total);

  return pages;
}

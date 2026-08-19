import ListingsClient from "@/src/components/ListingsClient";
import ErrorBoundary from "@/src/components/ErrorBoundary";

export default function ListingsPage() {
  return (
    <ErrorBoundary>
      <ListingsClient/>
    </ErrorBoundary>
  );
}

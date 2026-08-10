import ListingsClient from "@/components/ListingsClient";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ListingsPage() {
  return (
    <ErrorBoundary>
      <ListingsClient/>
    </ErrorBoundary>
  );
}

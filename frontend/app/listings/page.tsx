import ListingsClient from "@/src/components/ListingsClient";
import ErrorBoundary from "@/src/components/ErrorBoundary";

/*
  The listings page is the main view of the IDXExchange property search application.
  The Listings Client component is wrapped in an Error boundary in case of failures.
*/
export default function ListingsPage() {
  return (
    <ErrorBoundary>
      <ListingsClient/>
    </ErrorBoundary>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Loading content...
        </p>
      </div>
    </div>
  );
}

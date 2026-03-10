/**
 * Loading Page for News Details
 *
 * This page is displayed while a news article is being loaded.
 * Provides a skeleton loader for better user experience.
 *
 * Requirements: 6.5
 */
export default function NewsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Image skeleton */}
        <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>

        {/* Summary skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

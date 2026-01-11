/**
 * Loading Page for Regulation Details
 *
 * This page is displayed while a regulation is being loaded.
 * Provides a skeleton loader for better user experience.
 *
 * Requirements: 6.5
 */
export default function RegulationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Summary skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Section title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

        {/* Articles skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-l-4 border-gray-200 pl-6 py-4 bg-gray-50 rounded-r-lg"
            >
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

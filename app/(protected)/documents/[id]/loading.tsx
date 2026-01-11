/**
 * Loading Page for Document Details
 *
 * This page is displayed while a document is being loaded.
 * Provides a skeleton loader for better user experience.
 *
 * Requirements: 6.5
 */
export default function DocumentLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header skeleton */}
            <div className="bg-gray-200 px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                <div>
                  <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-gray-100"
                >
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>

            {/* Footer skeleton */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

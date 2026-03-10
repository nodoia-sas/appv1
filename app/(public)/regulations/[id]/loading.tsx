/**
 * Loading Page for Regulation Details
 *
 * This page is displayed while a regulation detail is being loaded.
 * Provides a skeleton loader for regulation detail interface.
 *
 * Requirements: 8.2, 8.3, 8.4
 */
export default function RegulationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-primary/10 px-6 py-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>

            {/* Metadata section */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags section */}
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-20"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>

            {/* Article content */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>

            {/* Related sections */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

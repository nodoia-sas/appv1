/**
 * Loading Page for Documents
 *
 * This page is displayed while the documents page is being loaded.
 * Provides a skeleton loader for document management interface.
 *
 * Requirements: 8.2, 8.3, 8.4
 */
export default function DocumentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-56"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex space-x-4 border-b border-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32 mb-2"></div>
          ))}
        </div>

        {/* Document cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              {/* Document header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>

              {/* Document details */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-6">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

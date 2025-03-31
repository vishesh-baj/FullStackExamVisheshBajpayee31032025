export default function ProductsLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar filter skeleton */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-[400px]"></div>
      </div>

      {/* Products grid skeleton */}
      <div className="flex-grow">
        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-gray-100 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded w-1/4 animate-pulse"></div>
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-lg animate-pulse h-72"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

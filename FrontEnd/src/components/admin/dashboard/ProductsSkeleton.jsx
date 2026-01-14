const ProductsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 h-64 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSkeleton;

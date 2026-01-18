const TopSellingProducts = ({ topSellingProducts = [] }) => {
  if (!topSellingProducts || topSellingProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-fire text-orange-500"></i>
          Top Selling Products
        </h3>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
          Top 5
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Units Sold</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">৳{product.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right">{product.totalSold}</td>
                <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">৳{product.totalRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;

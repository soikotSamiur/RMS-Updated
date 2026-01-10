const RevenueChart = ({ dailyTrends }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-chart-line text-orange-500 mr-2"></i>
        Revenue Trend
      </h2>
      <p className="text-sm text-gray-600 mb-4">Last 12 months performance</p>
      <div className="h-64 flex items-end justify-between space-x-2">
        {dailyTrends.length > 0 ? (
          dailyTrends.map((data, index) => {
            const maxRevenue = Math.max(...dailyTrends.map(d => d.revenue));
            const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div 
                    className="bg-orange-500 rounded-t hover:bg-orange-600 transition-colors cursor-pointer"
                    style={{ height: `${height * 2}px`, minHeight: '8px' }}
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      ৳{data.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">{data.month}</div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center h-full">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;

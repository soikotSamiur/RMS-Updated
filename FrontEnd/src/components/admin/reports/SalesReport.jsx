import React from 'react';

const SalesReport = ({ data, filters }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No sales data available for the selected period.
      </div>
    );
  }

  // Sort data by date to ensure proper trend calculation
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const totalPrice = sortedData.reduce((sum, day) => sum + day.totalPrice, 0);
  const totalRevenue = sortedData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = sortedData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalPrice / totalOrders : 0;

  // Find top performing day
  const topDay = sortedData.reduce((max, day) => day.totalPrice > max.totalPrice ? day : max, sortedData[0]);
  
  // Find worst performing day
  const worstDay = sortedData.reduce((min, day) => day.totalPrice < min.totalPrice ? day : min, sortedData[0]);

  // Calculate trends
  const revenueGrowth = sortedData.length > 1 
    ? ((sortedData[sortedData.length - 1].totalPrice - sortedData[0].totalPrice) / sortedData[0].totalPrice) * 100
    : 0;

  const averageOrdersPerDay = totalOrders / sortedData.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sales Report</h2>
        <div className="text-sm text-gray-600">
          {filters.startDate} to {filters.endDate} • {sortedData.length} days
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 font-medium">Total Price</div>
              <div className="text-2xl font-bold text-blue-800">৳{totalPrice.toLocaleString()}</div>
            </div>
            <div className="text-blue-600">
              <i className="fas fa-coins text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-700 font-medium">Revenue (40%)</div>
              <div className="text-2xl font-bold text-green-800">৳{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="text-green-600">
              <i className="fas fa-dollar-sign text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-green-600 mt-2">
            40% of total price
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-700 font-medium">Total Orders</div>
              <div className="text-2xl font-bold text-purple-800">{totalOrders}</div>
            </div>
            <div className="text-purple-600">
              <i className="fas fa-shopping-cart text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-purple-600 mt-2">
            ~{Math.round(averageOrdersPerDay)} orders/day
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-orange-700 font-medium">Average Order</div>
              <div className="text-2xl font-bold text-orange-800">৳{averageOrderValue.toFixed(2)}</div>
            </div>
            <div className="text-orange-600">
              <i className="fas fa-chart-pie text-xl"></i>
            </div>
          </div>
          <div className="text-xs text-orange-600 mt-2">
            Per customer average
          </div>
        </div>
      </div>

      {/* Enhanced Sales Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Day</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Total Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Revenue (40%)</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Orders</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Avg Order</th>
              {/* <th className="px-4 py-3 font-semibold text-gray-700">Performance</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((day, index) => {
              const previousDay = index > 0 ? sortedData[index - 1] : null;
              const revenueChange = previousDay 
                ? ((day.totalPrice - previousDay.totalPrice) / previousDay.totalPrice) * 100 
                : 0;
              
              const isBestDay = day.date === topDay.date;
              const isWorstDay = day.date === worstDay.date;
              
              let performanceColor = 'text-gray-600';
              if (isBestDay) performanceColor = 'text-green-600';
              else if (isWorstDay) performanceColor = 'text-red-600';
              else if (day.totalPrice > averageOrderValue * 10) performanceColor = 'text-blue-600';

              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayName = dayNames[new Date(day.date).getDay()];

              return (
                <tr key={day.date} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{day.date}</td>
                  <td className="px-4 py-3 text-gray-600">{dayName}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">৳{day.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">৳{day.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-purple-700">{day.orders}</td>
                  <td className="px-4 py-3 text-orange-700">৳{day.averageOrder.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
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
          {revenueGrowth !== 0 && (
            <div className={`text-xs mt-2 ${revenueGrowth > 0 ? 'text-blue-600' : 'text-red-600'}`}>
              <i className={`fas ${revenueGrowth > 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              {Math.abs(revenueGrowth).toFixed(1)}% {revenueGrowth > 0 ? 'growth' : 'decline'}
            </div>
          )}
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
              {/* <th className="px-4 py-3 font-semibold text-gray-700">Daily Trend</th> */}
              <th className="px-4 py-3 font-semibold text-gray-700">Performance</th>
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
                  {/* <td className="px-4 py-3 text-black">
                    {previousDay && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        revenueChange > 0 
                          ? 'bg-green-100 text-green-800' 
                          : revenueChange < 0 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <i className={`fas ${
                          revenueChange > 0 ? 'fa-arrow-up' : 
                          revenueChange < 0 ? 'fa-arrow-down' : 'fa-minus'
                        } mr-1`}></i>
                        {revenueChange !== 0 ? Math.abs(revenueChange).toFixed(1) + '%' : '0%'}
                      </span>
                    )}
                  </td> */}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${performanceColor}`}>
                      {isBestDay && <i className="fas fa-crown mr-1"></i>}
                      {isWorstDay && <i className="fas fa-exclamation-triangle mr-1"></i>}
                      {isBestDay ? 'Best Day' : 
                       isWorstDay ? 'Needs Attention' : 
                       day.revenue > averageOrderValue * 15 ? 'Great' : 
                       day.revenue > averageOrderValue * 10 ? 'Good' : 'Average'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Revenue Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Price & Revenue Trend Analysis</h3>
        
        {/* Line Chart */}
        <div className="relative h-64 p-4 bg-gray-50 rounded-lg mb-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(5)].map((_, i) => {
              const maxRevenue = Math.max(...sortedData.map(d => d.totalPrice));
              const value = maxRevenue - (maxRevenue / 4) * i;
              return (
                <div key={i} className="pr-2">
                  ৳{(value / 1000).toFixed(0)}k
                </div>
              );
            })}
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-gray-200"></div>
              ))}
            </div>

            {/* Line chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {/* Define gradient */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Area under the line */}
              <polygon
                fill="url(#lineGradient)"
                points={sortedData.map((day, index) => {
                  const maxRevenue = Math.max(...sortedData.map(d => d.totalPrice));
                  const minRevenue = Math.min(...sortedData.map(d => d.totalPrice));
                  const x = (index / (sortedData.length - 1)) * 100;
                  const y = 100 - (((day.totalPrice - minRevenue) / (maxRevenue - minRevenue)) * 90 + 5);
                  return `${x},${y}`;
                }).join(' ') + ` 100,100 0,100`}
                vectorEffect="non-scaling-stroke"
              />

              {/* Main line */}
              <polyline
                fill="none"
                stroke="rgb(249, 115, 22)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sortedData.map((day, index) => {
                  const maxRevenue = Math.max(...sortedData.map(d => d.totalPrice));
                  const minRevenue = Math.min(...sortedData.map(d => d.totalPrice));
                  const x = (index / (sortedData.length - 1)) * 100;
                  const y = 100 - (((day.totalPrice - minRevenue) / (maxRevenue - minRevenue)) * 90 + 5);
                  return `${x},${y}`;
                }).join(' ')}
                vectorEffect="non-scaling-stroke"
              />

              {/* Data points */}
              {sortedData.map((day, index) => {
                const maxRevenue = Math.max(...sortedData.map(d => d.totalPrice));
                const minRevenue = Math.min(...sortedData.map(d => d.totalPrice));
                const x = (index / (sortedData.length - 1)) * 100;
                const y = 100 - (((day.totalPrice - minRevenue) / (maxRevenue - minRevenue)) * 90 + 5);
                
                const isBestDay = day.date === topDay.date;
                const isWorstDay = day.date === worstDay.date;

                return (
                  <g key={day.date}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="5"
                      fill={isBestDay ? 'rgb(34, 197, 94)' : isWorstDay ? 'rgb(239, 68, 68)' : 'rgb(249, 115, 22)'}
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-8 transition-all cursor-pointer"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-600">
              {sortedData.map((day, index) => {
                // Show labels for first, last, and middle points
                const showLabel = index === 0 || 
                                  index === sortedData.length - 1 || 
                                  (sortedData.length > 5 && index === Math.floor(sortedData.length / 2));
                
                return showLabel ? (
                  <div key={day.date} className="text-center">
                    <div>{new Date(day.date).getDate()}</div>
                    <div className="text-gray-400">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(day.date).getDay()]}</div>
                  </div>
                ) : (
                  <div key={day.date}></div>
                );
              })}
            </div>

            {/* Hover tooltips */}
            {sortedData.map((day, index) => {
              const maxRevenue = Math.max(...sortedData.map(d => d.totalPrice));
              const minRevenue = Math.min(...sortedData.map(d => d.totalPrice));
              const x = (index / (sortedData.length - 1)) * 100;
              const y = 100 - (((day.totalPrice - minRevenue) / (maxRevenue - minRevenue)) * 90 + 5);
              
              const isBestDay = day.date === topDay.date;
              const isWorstDay = day.date === worstDay.date;

              return (
                <div
                  key={`tooltip-${day.date}`}
                  className="absolute group"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="w-3 h-3 cursor-pointer"></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                    <div className="font-semibold">{day.date}</div>
                    <div>Total Price: ৳{day.totalPrice.toLocaleString()}</div>
                    <div>Revenue (40%): ৳{day.revenue.toLocaleString()}</div>
                    <div>Orders: {day.orders}</div>
                    {isBestDay && <div className="text-green-400">👑 Best Day</div>}
                    {isWorstDay && <div className="text-red-400">⚠️ Needs Attention</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Best Performance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Regular Performance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Needs Attention</span>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(averageOrdersPerDay)}</div>
            <div className="text-sm text-gray-600">Avg Orders/Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {((totalPrice / sortedData.length) / 1000).toFixed(1)}k
            </div>
            <div className="text-sm text-gray-600">Avg Total Price/Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Period Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
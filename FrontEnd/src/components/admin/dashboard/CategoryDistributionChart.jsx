const CategoryDistributionChart = ({ categoryDistribution }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-chart-pie text-blue-500 mr-2"></i>
        Sales Distribution
      </h2>
      <p className="text-sm text-gray-600 mb-4">By category</p>
      <div className="flex items-center justify-center h-64">
        {categoryDistribution.length > 0 ? (
          <div className="relative">
            <svg width="250" height="250" viewBox="0 0 250 250">
              {(() => {
                const total = categoryDistribution.reduce((sum, item) => sum + item.value, 0);
                let currentAngle = 0;
                const colors = ['#EF4444', '#3B82F6', '#A855F7', '#F97316', '#10B981'];
                
                return categoryDistribution.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const angle = (item.value / total) * 360;
                  const startAngle = currentAngle;
                  currentAngle += angle;
                  
                  const x1 = 125 + 100 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 125 + 100 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 125 + 100 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                  const y2 = 125 + 100 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={index}
                      d={`M 125 125 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <title>{item.category}: ৳{item.value.toLocaleString()} ({percentage.toFixed(1)}%)</title>
                    </path>
                  );
                });
              })()}
            </svg>
          </div>
        ) : (
          <p className="text-gray-400">No category data available</p>
        )}
      </div>
      
      {/* Legend */}
      {categoryDistribution.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {categoryDistribution.map((item, index) => {
            const colors = ['#EF4444', '#3B82F6', '#A855F7', '#F97316', '#10B981'];
            return (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-xs text-gray-600">{item.category}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryDistributionChart;

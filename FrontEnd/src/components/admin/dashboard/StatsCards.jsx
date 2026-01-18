const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-green-700 font-medium">Total Revenue(This Month)</div>
            <div className="text-2xl font-bold text-green-800">৳{stats?.totalRevenue?.value?.toLocaleString() || '0'}</div>
          </div>
          <div className="text-green-600">
            <i class="fa-solid fa-bangladeshi-taka-sign"></i>
          </div>
        </div>
      </div>

      {/* Today's Orders */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-700 font-medium">Today's Orders</div>
            <div className="text-2xl font-bold text-blue-800">{stats?.todayOrders?.value || 0}</div>
          </div>
          <div className="text-blue-600">
            <i className="fas fa-shopping-cart text-xl"></i>
          </div>
        </div>
      </div>

      {/* Avg Order Value */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-purple-700 font-medium">Avg Order Value</div>
            <div className="text-2xl font-bold text-purple-800">৳{stats?.avgOrderValue?.value?.toLocaleString() || '0'}</div>
          </div>
          <div className="text-purple-600">
            <i className="fas fa-chart-line text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

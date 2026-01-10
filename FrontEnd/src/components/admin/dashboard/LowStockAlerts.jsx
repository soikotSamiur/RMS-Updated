const LowStockAlerts = ({ lowStockItems, onReorder }) => {
  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i>
          Low Stock Alerts
        </h3>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
          {lowStockItems.length} items
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {lowStockItems.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-yellow-100 rounded-lg">
            <div>
              <span className="font-semibold text-yellow-800 block">{item.name}</span>
              <span className="text-yellow-700 text-sm">{item.currentStock} {item.unit} remaining</span>
              {item.supplier && (
                <span className="text-yellow-600 text-xs block">Supplier: {item.supplier}</span>
              )}
            </div>
            <button 
              onClick={() => onReorder(item.id)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors ml-2"
            >
              <i className="fas fa-redo mr-1"></i>
              Reorder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlerts;

const BillDetailsModal = ({ bill, onClose, onDownload }) => {
  const items = JSON.parse(bill.items);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Bill Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bill Number and Date */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Bill Number</p>
                <p className="text-lg font-bold text-orange-600">{bill.bill_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(bill.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(bill.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <i className="fas fa-user mr-2 text-orange-500"></i>
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-semibold text-gray-800">{bill.customer_name}</span>
              </div>
              {bill.phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-semibold text-gray-800">{bill.phone}</span>
                </div>
              )}
              {bill.email && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-semibold text-gray-800">{bill.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <i className="fas fa-shopping-basket mr-2 text-orange-500"></i>
              Order Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Type:</span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  bill.order_type === 'Dine-in' ? 'bg-blue-100 text-blue-700' :
                  bill.order_type === 'Takeaway' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {bill.order_type}
                </span>
              </div>
              {bill.table_number && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Table Number:</span>
                  <span className="text-sm font-semibold text-gray-800">{bill.table_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-semibold text-gray-800">{bill.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <i className="fas fa-utensils mr-2 text-orange-500"></i>
              Items
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Item</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-right">{item.price} <i className="fa-solid fa-bangladeshi-taka-sign"></i></td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                        {(item.quantity * item.price).toFixed(2)} <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">{bill.subtotal} <i className="fa-solid fa-bangladeshi-taka-sign"></i></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold text-gray-800">{bill.tax} <i className="fa-solid fa-bangladeshi-taka-sign"></i></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-semibold text-red-600">-{bill.discount} <i className="fa-solid fa-bangladeshi-taka-sign"></i></span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2"></div>
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-green-600">{bill.total} <i className="fa-solid fa-bangladeshi-taka-sign"></i></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={() => onDownload(bill)}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            <i className="fas fa-download mr-2"></i>
            Download Bill
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;

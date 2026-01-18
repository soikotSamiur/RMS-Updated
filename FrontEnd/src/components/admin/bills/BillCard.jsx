const BillCard = ({ bill, onViewDetails, onDelete, onDownload }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Bill Number */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Bill Number</p>
            <p className="font-semibold text-gray-800">{bill.bill_number}</p>
          </div>

          {/* Customer Name */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer</p>
            <p className="font-semibold text-gray-800">{bill.customer_name}</p>
          </div>

          {/* Order Type */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Order Type</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              bill.order_type === 'Dine-in' ? 'bg-blue-100 text-blue-700' :
              bill.order_type === 'Takeaway' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {bill.order_type}
            </span>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
            <p className="font-semibold text-gray-800">{bill.payment_method}</p>
          </div>

          {/* Total Amount */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="font-bold text-green-600">{bill.total} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
          </div>

          {/* Date */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="text-sm text-gray-700">
              {new Date(bill.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(bill.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onViewDetails(bill)}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="View Details"
          >
            <i className="fas fa-eye"></i>
          </button>
          
          <button
            onClick={() => onDownload(bill)}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            title="Download Bill"
          >
            <i className="fas fa-download"></i>
          </button>
          
          <button
            onClick={() => onDelete(bill.id)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            title="Delete Bill"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillCard;

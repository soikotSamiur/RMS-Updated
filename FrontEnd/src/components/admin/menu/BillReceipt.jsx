import { useRef } from 'react';

const BillReceipt = ({ order, cart, onClose }) => {
  const receiptRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printContent = receiptRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const currentDate = new Date().toLocaleString();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Receipt Content */}
          <div ref={receiptRef} className="p-8">
            <div className="text-center mb-6 border-b-2 border-dashed pb-4">
              <h1 className="text-2xl font-bold text-gray-800">DineSmart</h1>
              <p className="text-sm text-gray-600">Road 12, Sector 10, Uttara</p>
              <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
              <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
            </div>

            {/* Order Details */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Order #:</span>
                <span>{order?.id || 'PENDING'}</span>
              </div>
              {order?.tableNumber && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">Table #:</span>
                  <span>{order.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Status:</span>
                <span className="text-green-600 font-semibold">{order?.status || 'COMPLETED'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="border-t-2 border-b-2 border-dashed py-4 mb-4">
              <h3 className="font-bold mb-3">Order Items:</h3>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600 text-xs">
                        {item.quantity} x ৳{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">৳{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>৳{order?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>৳{order?.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                <span>Total:</span>
                <span>৳{order?.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-center text-green-700 font-semibold">
                <i className="fas fa-check-circle mr-2"></i>
                Payment Received
              </p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600 border-t-2 border-dashed pt-4">
              <p className="font-semibold mb-1">Thank you for your order!</p>
              <p>Please visit again</p>
              <p className="mt-2">This is a computer-generated receipt</p>
            </div>
          </div>

          {/* Action Buttons - Only shown on screen, hidden when printing */}
          <div className="p-4 bg-gray-50 border-t flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-print"></i>
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed, .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default BillReceipt;

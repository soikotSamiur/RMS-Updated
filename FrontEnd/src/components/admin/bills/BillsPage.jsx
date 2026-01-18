import { useState, useEffect } from 'react';
import billService from '../../../services/billService';
import BillCard from './BillCard';
import BillDetailsModal from './BillDetailsModal';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await billService.getBills({
        page: currentPage,
        per_page: 15
      });
      
      if (response.success) {
        setBills(response.bills.data || []);
        setTotalPages(response.bills.last_page || 1);
      } else {
        setError('Failed to fetch bills');
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError(error.response?.data?.message || 'Failed to load bills. Please try again.');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailsModal(true);
  };

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    
    try {
      await billService.deleteBill(id);
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill');
    }
  };

  const handleDownloadBill = (bill) => {
    // Generate PDF using window.print
    generateBillPDF(bill);
  };

  const generateBillPDF = (bill) => {
    const items = JSON.parse(bill.items);
    
    // Create a new window with the bill content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${bill.bill_number}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .info-section {
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #333;
            color: white;
          }
          .total-section {
            margin-top: 20px;
            text-align: right;
          }
          .total-row {
            padding: 5px 0;
          }
          .grand-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RESTAURANT RECEIPT</h1>
          <h2>${bill.bill_number}</h2>
          <p>Date: ${new Date(bill.created_at).toLocaleString()}</p>
        </div>

        <div class="info-section">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${bill.customer_name}</p>
          ${bill.phone ? `<p><strong>Phone:</strong> ${bill.phone}</p>` : ''}
          ${bill.email ? `<p><strong>Email:</strong> ${bill.email}</p>` : ''}
          <p><strong>Order Type:</strong> ${bill.order_type}</p>
          ${bill.table_number ? `<p><strong>Table Number:</strong> ${bill.table_number}</p>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} Tk</td>
                <td>${(item.quantity * item.price).toFixed(2)} Tk</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row"><strong>Subtotal:</strong> ${bill.subtotal} Tk</div>
          <div class="total-row"><strong>Tax:</strong> ${bill.tax} Tk</div>
          <div class="total-row"><strong>Discount:</strong> ${bill.discount} Tk</div>
          <div class="grand-total"><strong>TOTAL:</strong> ${bill.total} Tk</div>
        </div>

        <div class="info-section" style="margin-top: 30px;">
          <p><strong>Payment Method:</strong> ${bill.payment_method}</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><strong>Thank you for your visit!</strong></p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bills Management</h1>
        <p className="text-gray-600 mt-1">View and download all generated bills</p>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {/* Bills List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <i className="fas fa-file-invoice text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-600 text-lg">No bills found</p>
          <p className="text-gray-400 text-sm">Bills generated from orders will appear here</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {bills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteBill}
                onDownload={handleDownloadBill}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Bill Details Modal */}
      {showDetailsModal && selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => setShowDetailsModal(false)}
          onDownload={handleDownloadBill}
        />
      )}
    </div>
  );
};

export default BillsPage;

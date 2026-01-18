import { useState, useEffect } from 'react';
import OrderStats from './OrderStats';
import OrderFilterTabs from './OrderFilterTabs';
import OrderCardsGrid from './OrderCardsGrid';
import OrderTable from './OrderTable';
import OrderActions from './OrderActions';
import NewOrderModal from './NewOrderModal';
import Pagination from '../../common/Pagination';
import apiService from '../../../services/apiService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.orders.getOrders({
        page: currentPage,
        per_page: itemsPerPage,
        status: selectedStatus
      });
      setOrders(response.data || []);
      const total = response.pagination?.total || 0;
      setTotalItems(total);
      setTotalPages(response.pagination?.total_pages || 0);
      
      // Calculate stats with correct counts from backend
      calculateStats(total, response.status_counts || {});
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate order statistics
  const calculateStats = (total, statusCounts) => {
    const stats = {
      total: total,
      completed: statusCounts.completed || 0,
      pending: statusCounts.pending || 0,
      preparing: statusCounts.preparing || 0,
      ready: statusCounts.ready || 0,
      cancelled: statusCounts.cancelled || 0
    };
    setOrderStats(stats);
  };

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, itemsPerPage]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await apiService.orders.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // Refresh orders after status update
        await fetchOrders();
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Failed to update order status:', err);
    }
  };

  // Add new order
  const addNewOrder = () => {
    setEditingOrder(null);
    setIsNewOrderModalOpen(true);
  };

  // Handle new order creation
  const handleOrderCreated = async (newOrder) => {
    // Refresh orders after creation
    await fetchOrders();
    setError(null);
  };

  // Handle edit order
  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsNewOrderModalOpen(true);
  };

  // Handle order update
  const handleOrderUpdated = async (updatedOrder) => {
    // Refresh orders after update
    await fetchOrders();
    setEditingOrder(null);
    setError(null);
  };

  // Print orders
  const printOrders = () => {
    window.print();
  };

  return (
    <div className=" md:p-2">
      {/* Orders Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600">Manage and track all restaurant orders</p>
          </div>
          <OrderActions 
            onAddNewOrder={addNewOrder}
            onPrintOrders={printOrders}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Order Statistics */}
        <OrderStats stats={orderStats} />
      </div>

      {/* Order Filter Tabs */}
      <OrderFilterTabs 
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              Orders will appear here once customers place them through the menu page. 
              Start by going to the Menu page, adding items to cart, and processing a payment.
            </p>
            <button
              onClick={addNewOrder}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Create Manual Order
            </button>
          </div>
        </div>
      )}

      {/* Orders Display */}
      {!loading && !error && orders.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <OrderCardsGrid 
              orders={orders}
              onStatusUpdate={updateOrderStatus}
              onEditOrder={handleEditOrder}
            />
          ) : (
            <OrderTable 
              orders={orders}
              onStatusUpdate={updateOrderStatus}
              onEditOrder={handleEditOrder}
            />
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </>
      )}

      {/* New Order Modal */}
      <NewOrderModal 
        isOpen={isNewOrderModalOpen}
        onClose={() => {
          setIsNewOrderModalOpen(false);
          setEditingOrder(null);
        }}
        onOrderCreated={handleOrderCreated}
        onOrderUpdated={handleOrderUpdated}
        editingOrder={editingOrder}
      />
    </div>
  );
};

export default OrdersPage;
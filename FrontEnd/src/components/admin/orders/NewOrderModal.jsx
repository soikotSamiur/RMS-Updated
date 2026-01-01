import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const NewOrderModal = ({ isOpen, onClose, onOrderCreated, onOrderUpdated, editingOrder }) => {
  const [orderType, setOrderType] = useState('dine-in');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    tableNumber: '',
    guests: '',
    address: '',
    items: [],
    specialInstructions: ''
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingOrder && isOpen) {
      setOrderType(editingOrder.type);
      setFormData({
        customerName: editingOrder.customerName || '',
        phone: editingOrder.phone || '',
        email: editingOrder.email || '',
        tableNumber: editingOrder.tableNumber || '',
        guests: editingOrder.guests || '',
        address: editingOrder.address || '',
        specialInstructions: editingOrder.specialInstructions || ''
      });
      setSelectedItems(editingOrder.items || []);
    } else if (!editingOrder && isOpen) {
      resetForm();
    }
  }, [editingOrder, isOpen]);

  // Fetch menu items when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMenuItems();
    }
  }, [isOpen]);

  const fetchMenuItems = async () => {
    try {
      setLoadingMenu(true);
      const response = await apiService.menu.getMenuItems();
      if (response.success && response.data) {
        // Filter only available items and format for order selection
        const formattedItems = response.data
          .filter(item => item.available)
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            image: item.image
          }));
        setAvailableItems(formattedItems);
      }
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
      // Keep empty array on error
      setAvailableItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find(i => i.id === item.id);
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setSelectedItems(prev => [
        ...prev,
        { ...item, quantity: 1 }
      ]);
    }
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setSelectedItems(prev =>
        prev.map(i =>
          i.id === itemId
            ? { ...i, quantity }
            : i
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (selectedItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }
    if (orderType === 'dine-in' && !formData.tableNumber) {
      setError('Table number is required for dine-in orders');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        type: orderType,
        tableNumber: orderType === 'dine-in' ? parseInt(formData.tableNumber) : null,
        guests: orderType === 'dine-in' ? parseInt(formData.guests) : null,
        address: null,
        items: selectedItems,
        specialInstructions: formData.specialInstructions,
        total: parseFloat(calculateTotal())
      };

      let response;
      if (editingOrder) {
        // Update existing order
        response = await apiService.orders.updateOrder(editingOrder.id, orderData);
      } else {
        // Create new order
        response = await apiService.orders.createOrder(orderData);
      }

      if (response.success) {
        if (editingOrder) {
          onOrderUpdated(response.data);
        } else {
          onOrderCreated(response.data);
        }
        resetForm();
        onClose();
      }
    } catch (err) {
      setError(err.message || `Failed to ${editingOrder ? 'update' : 'create'} order`);
      console.error(`Error ${editingOrder ? 'updating' : 'creating'} order:`, err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      tableNumber: '',
      guests: '',
      address: '',
      items: [],
      specialInstructions: ''
    });
    setSelectedItems([]);
    setOrderType('dine-in');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">{editingOrder ? 'Edit Order' : 'Create New Order'}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Type Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Order Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['dine-in', 'takeaway'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`p-3 rounded-lg text-center capitalize transition-all ${
                      orderType === type
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
                    }`}
                  >
                    <i className={`fas fa-${type === 'dine-in' ? 'utensils' : 'shopping-bag'} mr-1`}></i>
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Information</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Customer Name *"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                />
              </div>
            </div>

            {/* Order Specific Details */}
            {orderType === 'dine-in' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Dine-In Details</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="tableNumber"
                    placeholder="Table Number *"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                    required
                  />
                  <input
                    type="number"
                    name="guests"
                    placeholder="Number of Guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Items Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Items</label>
              {loadingMenu ? (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading menu items...</p>
                  </div>
                </div>
              ) : availableItems.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">No menu items available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {availableItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddItem(item)}
                      className="bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-all text-left overflow-hidden"
                    >
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-20 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      )}
                      <div className="p-2">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.price.toFixed(2)} <i className="fa-solid fa-bangladeshi-taka-sign"></i></div>
                      </div>
                  </button>
                ))}
              </div>
              )}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Order Items ({selectedItems.length})</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 grid grid-cols-5 gap-2 p-3 text-xs font-semibold text-gray-700">
                    <div>Item</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Qty</div>
                    <div className="text-right">Total</div>
                    <div className="text-center">Action</div>
                  </div>
                  {selectedItems.map(item => (
                    <div key={item.id} className="grid grid-cols-5 gap-2 p-3 border-t border-gray-200 items-center">
                      <div className="text-sm text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-800 text-center">{item.price.toFixed(2)} <i className="fa-solid fa-bangladeshi-taka-sign"></i></div>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:border-orange-500"
                      />
                      <div className="text-sm text-gray-800 text-right">{(item.price * item.quantity).toFixed(2)} <i className="fa-solid fa-bangladeshi-taka-sign"></i></div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors text-center"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                  <div className="bg-orange-50 grid grid-cols-5 gap-2 p-3 border-t border-gray-200 font-semibold">
                    <div></div>
                    <div></div>
                    <div className="text-center">Total:</div>
                    <div className="text-right text-orange-600">{calculateTotal()} <i className="fa-solid fa-bangladeshi-taka-sign"></i></div>
                    <div></div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
              <textarea
                name="specialInstructions"
                placeholder="Any special requests or instructions..."
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-white"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">
                      <i className="fas fa-spinner"></i>
                    </span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Create Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;

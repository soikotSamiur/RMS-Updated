import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/apiService';
import InventoryStats from './InventoryStats';
import SearchFilterBar from './SearchFilterBar';
import InventoryTable from './InventoryTable';
import LowStocksAlerts from './LowStocksAlerts';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import Notification from './Notification';

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async (filters = {}) => {
    try {
      setIsLoading(true);
      const response = await apiService.inventory.getInventory(filters);
      
      if (response.success) {
        setInventoryItems(response.data);
        setFilteredItems(response.data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      showNotification('Failed to load inventory. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  // Initialize inventory
  useEffect(() => {
    fetchInventory();
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const filterInventory = (searchTerm = '', categoryFilter = 'all', statusFilter = 'all') => {
    const filtered = inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredItems(filtered);
  };

  const handleAddItem = async (newItemData) => {
    try {
      const response = await apiService.inventory.createInventoryItem(newItemData);
      
      if (response.success) {
        await fetchInventory();
        setShowAddModal(false);
        showNotification('Item added successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to add inventory item:', err);
      showNotification(err.response?.data?.message || 'Failed to add item', 'error');
    }
  };

  const handleEditItem = async (updatedItemData) => {
    try {
      const response = await apiService.inventory.updateInventoryItem(editingItem.id, updatedItemData);
      
      if (response.success) {
        await fetchInventory();
        setShowEditModal(false);
        setEditingItem(null);
        showNotification('Item updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to update inventory item:', err);
      showNotification(err.response?.data?.message || 'Failed to update item', 'error');
    }
  };

  const openEditItemModal = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const updateStock = async (itemId, change) => {
    try {
      const response = await apiService.inventory.updateStock(itemId, change);
      
      if (response.success) {
        await fetchInventory();
        const itemName = inventoryItems.find(item => item.id === itemId)?.name;
        showNotification(`Stock updated for ${itemName}`, 'success');
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
      showNotification(err.response?.data?.message || 'Failed to update stock', 'error');
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await apiService.inventory.deleteInventoryItem(itemId);
      
      if (response.success) {
        await fetchInventory();
        showNotification('Item deleted successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      showNotification(err.response?.data?.message || 'Failed to delete item', 'error');
    }
  };

  const reorderItem = (itemId) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    showNotification(`Reorder request sent for ${item.name} to ${item.supplier}`, 'info');
  };

  const exportInventory = () => {
    const dataStr = JSON.stringify(inventoryItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Inventory exported successfully!', 'success');
  };

  const refreshInventory = async () => {
    await fetchInventory();
    showNotification('Inventory refreshed!', 'success');
  };

  if (isLoading) {
    return (
      <div className="page-content p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  const { user } = useAuth();

  return (
    <div className="page-content  md:p-2">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Manage your restaurant inventory and track stock levels</p>
          </div>
          <div className="grid grid-cols-1 mt-2 md:mt-0 md:grid-cols-3 gap-2">
            {user && user.role === 'Admin' ? (
              <>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i> Add New Item
                </button>
                <button 
                  onClick={exportInventory}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-download"></i> Export Inventory
                </button>
                <button 
                  onClick={refreshInventory}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-sync"></i> Refresh
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={refreshInventory}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <i className="fas fa-sync"></i> Refresh
                </button>
              </>
            )}
          </div>
        </div>

        <InventoryStats inventoryItems={inventoryItems} />
      </div>

      <SearchFilterBar onFilter={filterInventory} />
      
      <InventoryTable 
        items={filteredItems}
        onEdit={openEditItemModal}
        onUpdateStock={updateStock}
        onDelete={deleteItem}
      />

      <LowStocksAlerts 
        inventoryItems={inventoryItems}
        onReorder={reorderItem}
      />

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddItem}
        />
      )}

      {showEditModal && editingItem && (
        <EditItemModal 
          item={editingItem}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleEditItem}
        />
      )}

      {notification.show && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default InventoryPage;
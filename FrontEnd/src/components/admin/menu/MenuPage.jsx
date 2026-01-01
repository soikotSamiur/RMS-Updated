import { useState, useEffect } from 'react';
import MenuHeader from './MenuHeader';
import CategoryFilter from './CategoryFilter';
import MenuGrid from './MenuGrid';
import CartSection from './CartSection';
import QuickActions from './QuickActions';
import AddMenuItemModal from './AddMenuItemModal';
import BillReceipt from './BillReceipt';
import apiService from '../../../services/apiService';

const MenuPage = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [currentOrder, setCurrentOrder] 
    = useState(null);
    const [tableNumber, setTableNumber] = useState('');

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [categoriesRes, itemsRes] = await Promise.all([
                apiService.menu.getCategories(),
                apiService.menu.getMenuItems()
            ]);
            
            setCategories(categoriesRes.data || []);
            setMenuItems(itemsRes.data || []);
        } catch (err) {
            console.error('Failed to fetch menu data:', err);
            setError(err.message || 'Failed to fetch menu');
            showNotification('Error loading menu data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Filter menu items based on category and search
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Add item to cart
    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
        showNotification(`${item.name} added to cart`, 'success');
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    // Update item quantity in cart
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        showNotification('Cart cleared', 'info');
    };

    // Calculate total amount
    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calculate total items
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculate menu stats
    const getMenuStats = () => {
        return {
            totalItems: menuItems.length,
            totalCategories: categories.length - 1, // Exclude 'all' category
            availableItems: menuItems.filter(item => item.available).length,
            outOfStock: menuItems.filter(item => !item.available).length
        };
    };

    // Handle add new item
    const handleAddNewItem = async (newItem) => {
        try {
            setLoading(true);
            const response = await apiService.menu.createMenuItem(newItem);
            
            if (response.success) {
                setMenuItems([...menuItems, response.data]);
                showNotification('Menu item added successfully', 'success');
                setShowAddModal(false);
                
                // Refresh categories to update counts
                const categoriesRes = await apiService.menu.getCategories();
                setCategories(categoriesRes.data || []);
            }
        } catch (err) {
            console.error('Failed to add menu item:', err);
            showNotification('Failed to add menu item', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit item
    const handleEditItem = async (itemId, updatedItem) => {
        console.log('Editing item:', itemId, updatedItem);
        try {
            setLoading(true);
            const response = await apiService.menu.updateMenuItem(itemId, updatedItem);
            
            if (response.success) {
                setMenuItems(menuItems.map(item => 
                    item.id === itemId ? response.data : item
                ));
                showNotification('Menu item updated successfully', 'success');
                setEditingItem(null);
                setShowAddModal(false);
                
                // Refresh categories to update counts
                const categoriesRes = await apiService.menu.getCategories();
                setCategories(categoriesRes.data || []);
            }
        } catch (err) {
            console.error('Failed to update menu item:', err);
            showNotification('Failed to update menu item', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete item
    const handleDeleteItem = async (itemId) => {
        // Confirmation is now handled in MenuGrid
        console.log('Deleting item:', itemId);
        
        try {
            setLoading(true);
            const response = await apiService.menu.deleteMenuItem(itemId);
            
            if (response.success) {
                setMenuItems(menuItems.filter(item => item.id !== itemId));
                
                // Remove from cart if exists
                setCart(cart.filter(item => item.id !== itemId));
                
                showNotification('Menu item deleted successfully', 'success');
                
                // Refresh categories to update counts
                const categoriesRes = await apiService.menu.getCategories();
                setCategories(categoriesRes.data || []);
            }
        } catch (err) {
            console.error('Failed to delete menu item:', err);
            showNotification('Failed to delete menu item', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle toggle availability
    const handleToggleAvailability = async (itemId) => {
        console.log('Toggling availability for item:', itemId);
        try {
            const response = await apiService.menu.toggleAvailability(itemId);
            
            if (response.success) {
                setMenuItems(menuItems.map(item => 
                    item.id === itemId ? response.data : item
                ));
                showNotification(response.message, 'success');
            }
        } catch (err) {
            console.error('Failed to toggle availability:', err);
            showNotification('Failed to update availability', 'error');
        }
    };

    // Open edit modal
    const openEditModal = (item) => {
        console.log('Opening edit modal for item:', item);
        setEditingItem(item);
        setShowAddModal(true);
    };

    // Handle process payment
    const handleProcessPayment = async () => {
        if (cart.length === 0) return;

        try {
            setLoading(true);
            
            // Calculate order totals
            const subtotal = getTotalAmount();
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            // Prepare order data matching backend requirements
            const orderData = {
                customerName: 'Walk-in Customer',
                phone: '',
                email: '',
                type: 'dine-in',
                tableNumber: tableNumber ? parseInt(tableNumber) : null,
                guests: null,
                address: '',
                specialInstructions: '',
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: total
            };

            // Create order
            const response = await apiService.orders.createOrder(orderData);
            
            if (response.success) {
                // Set current order for receipt
                setCurrentOrder({
                    id: response.data.id,
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    status: response.data.status || 'completed',
                    tableNumber: tableNumber
                });
                
                // Show receipt
                setShowReceipt(true);
                
                // Show success notification
                showNotification('Order saved successfully!', 'success');
            }
        } catch (err) {
            console.error('Failed to create order:', err);
            showNotification('Failed to process payment', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Close receipt and clear cart
    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setCurrentOrder(null);
        setTableNumber('');
        clearCart();
    };

    return (
        <div className="md:p-2">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
                    notification.type === 'success' ? 'bg-green-500 text-white' :
                    notification.type === 'error' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                }`}>
                    <div className="flex items-center gap-2">
                        <i className={`fas ${
                            notification.type === 'success' ? 'fa-check-circle' :
                            notification.type === 'error' ? 'fa-exclamation-circle' :
                            'fa-info-circle'
                        }`}></i>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-gray-700">Loading...</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <button 
                        onClick={fetchMenuData}
                        className="ml-4 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Menu Header with Stats and Search */}
            <MenuHeader
                stats={getMenuStats()}
                onAddNewItem={() => {
                    setEditingItem(null);
                    setShowAddModal(true);
                }}
            />

            {/* Quick Actions */}
            <QuickActions
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
            />

            <div className="flex gap-5 flex-col lg:flex-row">
                {/* Left Side - Menu Content */}
                <div className="w-full lg:w-3/4">
                    {/* Category Filter */}
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    {/* Menu Grid */}
                    <MenuGrid
                        items={filteredItems}
                        onAddToCart={addToCart}
                        onEditItem={openEditModal}
                        onDeleteItem={handleDeleteItem}
                        onToggleAvailability={handleToggleAvailability}
                    />

                    {/* Empty State */}
                    {filteredItems.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <i className="fas fa-utensils text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery ? 'Try a different search term' : 'Start by adding your first menu item'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => {
                                        setEditingItem(null);
                                        setShowAddModal(true);
                                    }}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Add First Item
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side - Cart Section */}
                <div className="w-full lg:w-1/4">
                    <CartSection
                        cart={cart}
                        onRemoveFromCart={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onClearCart={clearCart}
                        totalAmount={getTotalAmount()}
                        totalItems={getTotalItems()}
                        onProcessPayment={handleProcessPayment}
                        tableNumber={tableNumber}
                        onTableNumberChange={setTableNumber}
                    />
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            <AddMenuItemModal 
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                }}
                onItemAdded={handleAddNewItem}
                onItemUpdated={handleEditItem}
                editingItem={editingItem}
                categories={categories.filter(cat => cat.id !== 'all')}
            />

            {/* Bill Receipt Modal */}
            {showReceipt && currentOrder && (
                <BillReceipt 
                    order={currentOrder}
                    cart={cart}
                    onClose={handleCloseReceipt}
                />
            )}
        </div>
    );
};

export default MenuPage;
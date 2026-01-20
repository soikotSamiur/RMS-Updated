import { useState, useEffect } from 'react';
import MenuHeader from './MenuHeader';
import CategoryFilter from './CategoryFilter';
import MenuGrid from './MenuGrid';
import CartSection from './CartSection';
import QuickActions from './QuickActions';
import AddMenuItemModal from './AddMenuItemModal';
import BillReceipt from './BillReceipt';
import Pagination from '../../common/Pagination';
import apiService from '../../../services/apiService';
import billService from '../../../services/billService';

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
    const [paymentMethod, setPaymentMethod] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalAvailable, setTotalAvailable] = useState(0);
    const [totalOutOfStock, setTotalOutOfStock] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchMenuItems();
    }, [currentPage, itemsPerPage, selectedCategory, searchQuery]);

    const fetchCategories = async () => {
        try {
            const categoriesRes = await apiService.menu.getCategories();
            setCategories(categoriesRes.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };
// Fetch menu items-1
    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiService.menu.getMenuItems({
                page: currentPage,
                per_page: itemsPerPage,
                category: selectedCategory,
                search: searchQuery
            });
            
            setMenuItems(response.data || []);
            setTotalItems(response.pagination?.total || 0);
            setTotalPages(response.pagination?.total_pages || 0);
            const allItems = response.data || [];
            const availableCount = allItems.filter(item => item.available).length;
            const outOfStockCount = allItems.filter(item => !item.available).length;
            if (response.stats) {
                setTotalAvailable(response.stats.available || availableCount);
                setTotalOutOfStock(response.stats.out_of_stock || outOfStockCount);
            } else {
                setTotalAvailable(availableCount);
                setTotalOutOfStock(outOfStockCount);
            }
        } catch (err) {
            console.error('Failed to fetch menu items:', err);
            setError(err.message || 'Failed to fetch menu');
            showNotification('Error loading menu data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuData = async () => {
        await fetchCategories();
        await fetchMenuItems();
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [selectedCategory, searchQuery, itemsPerPage]);



// Add item to cart-2
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

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

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

    const clearCart = () => {
        setCart([]);
        showNotification('Cart cleared', 'info');
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getMenuStats = () => {
        return {
            totalItems: totalItems,
            totalCategories: categories.length - 1, 
            availableItems: totalAvailable,
            outOfStock: totalOutOfStock
        };
    };

// Handle add new item-3
    const handleAddNewItem = async (newItem) => {
        try {
            setLoading(true);
            const response = await apiService.menu.createMenuItem(newItem);
            
            if (response.success) {
                showNotification('Menu item added successfully', 'success');
                setShowAddModal(false);
                
                await fetchMenuItems();
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add menu item:', err);
            showNotification('Failed to add menu item', 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

// Handle edit item-4
    const handleEditItem = async (itemId, updatedItem) => {
        console.log('Editing item:', itemId, updatedItem);
        try {
            setLoading(true);
            const response = await apiService.menu.updateMenuItem(itemId, updatedItem);
            
            if (response.success) {
                showNotification('Menu item updated successfully', 'success');
                setEditingItem(null);
                setShowAddModal(false);
                await fetchMenuItems();
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update menu item:', err);
            showNotification('Failed to update menu item', 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Handle delete item-5
    const handleDeleteItem = async (itemId) => {
        console.log('Deleting item:', itemId);
        
        try {
            setLoading(true);
            const response = await apiService.menu.deleteMenuItem(itemId);
            
            if (response.success) {
                setCart(cart.filter(item => item.id !== itemId)); 
                showNotification('Menu item deleted successfully', 'success');
                await fetchMenuItems();
            }
        } catch (err) {
            console.error('Failed to delete menu item:', err);
            showNotification('Failed to delete menu item', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle toggle availability-6
    const handleToggleAvailability = async (itemId) => {
        console.log('Toggling availability for item:', itemId);
        try {
            const response = await apiService.menu.toggleAvailability(itemId);
            
            if (response.success) {
                showNotification(response.message, 'success');
                await fetchMenuItems();
            }
        } catch (err) {
            console.error('Failed to toggle availability:', err);
            showNotification('Failed to update availability', 'error');
        }
    };

    const openEditModal = (item) => {
        console.log('Opening edit modal for item:', item);
        setEditingItem(item);
        setShowAddModal(true);
    };

    // Handle process payment-7
    const handleProcessPayment = async () => {
        if (cart.length === 0) return;

        try {
            setLoading(true);
            const subtotal = getTotalAmount();
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

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
                await generateBillForOrder(response.data.id, subtotal, tax, total);
                setCurrentOrder({
                    id: response.data.id,
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    status: response.data.status || 'completed',
                    tableNumber: tableNumber
                });
                
                setShowReceipt(true);
                showNotification('Order saved successfully!', 'success');
            }
        } catch (err) {
            console.error('Failed to create order:', err);
            showNotification('Failed to process payment.There maybe insufficient ingredient stock in any item', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Generate bill for order-8
    const generateBillForOrder = async (orderId, subtotal, tax, total) => {
        try {
            const billData = {
                order_id: orderId,
                customer_name: 'Walk-in Customer',
                phone: '',
                email: '',
                order_type: 'Dine-in',
                table_number: tableNumber ? parseInt(tableNumber) : null,
                subtotal: subtotal,
                tax: tax,
                discount: 0,
                total: total,
                payment_method: paymentMethod || 'Cash',
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await billService.createBill(billData);
            console.log('Bill generated successfully for order:', orderId);
        } catch (err) {
            console.error('Failed to generate bill:', err);
        }
    };

    // Close receipt and clear cart
    const handleCloseReceipt = () => {
        setShowReceipt(false);
        setCurrentOrder(null);
        setTableNumber('');
        setPaymentMethod('');
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

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && menuItems.length === 0 && (
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

            {/* Menu Display */}
            {!loading && menuItems.length > 0 && (
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
                            items={menuItems}
                            onAddToCart={addToCart}
                            onEditItem={openEditModal}
                            onDeleteItem={handleDeleteItem}
                            onToggleAvailability={handleToggleAvailability}
                        />

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
                            paymentMethod={paymentMethod}
                            onPaymentMethodChange={setPaymentMethod}
                        />
                    </div>
                </div>
            )}

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
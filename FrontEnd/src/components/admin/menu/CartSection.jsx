import { useState } from 'react';

const CartSection = ({ cart, onRemoveFromCart, onUpdateQuantity, onClearCart, totalAmount, totalItems, onProcessPayment, tableNumber, onTableNumberChange }) => {
  const [isCartOpen, setIsCartOpen] = useState(true);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Call the parent's payment handler
    onProcessPayment();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
      {/* Cart Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">Order Cart</h2>
          {totalItems > 0 && (
            <span className="bg-orange-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-orange-500 transition-colors"
          >
            <i className={`fas fa-chevron-${isCartOpen ? 'up' : 'down'}`}></i>
          </button>
          <button 
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {isCartOpen && (
        <>
          {/* Table Number Input */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <i className="fas fa-table mr-1 text-xs"></i>Table Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              placeholder="Enter table number"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              min="1"
              required
            />
            {!tableNumber && (
              <p className="text-xs text-red-500 mt-1">
                <i className="fas fa-exclamation-circle mr-1"></i>
                Table number is required
              </p>
            )}
          </div>

          {/* Cart Items */}
          <div className="max-h-72 overflow-y-auto mb-3">
            {cart.length === 0 ? (
              <div className="text-center py-6">
                <i className="fas fa-shopping-cart text-3xl text-gray-300 mb-3"></i>
                <p className="text-sm text-gray-500">Your cart is empty</p>
                <p className="text-xs text-gray-400">Add items from the menu</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                      <p className="text-xs text-black font-bold">{item.price} <i className="fa-solid fa-bangladeshi-taka-sign"></i></p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs hover:bg-gray-300 text-black"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm w-6 text-center text-black">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs hover:bg-gray-300 text-black"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <>
              <div className="border-t pt-3 mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-sm text-black"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-600">Tax (8%):</span>
                  <span className="font-semibold text-sm text-black"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-base text-black"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {(totalAmount * 1.08).toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div>
                <button 
                  onClick={handleCheckout}
                  disabled={!tableNumber}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-credit-card"></i>
                  Process Payment
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CartSection;
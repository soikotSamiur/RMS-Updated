import { useState, useEffect, useRef } from 'react';

const MenuGrid = ({ items, onAddToCart, onEditItem, onDeleteItem, onToggleAvailability }) => {
  const [showActions, setShowActions] = useState({});
  const dropdownRefs = useRef({});

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
  };

  const toggleActions = (itemId, event) => {
    event?.stopPropagation();
    console.log('toggleActions called for item:', itemId);
    console.log('Current showActions state:', showActions);
    setShowActions(prev => {
      const newState = {};
      newState[itemId] = !prev[itemId];
      console.log('New showActions state:', newState);
      return newState;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      let shouldClose = true;
      Object.keys(dropdownRefs.current).forEach(itemId => {
        if (dropdownRefs.current[itemId]?.contains(event.target)) {
          shouldClose = false;
        }
      });
      if (shouldClose) {
        setShowActions({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <i className="fas fa-utensils text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
        <p className="text-gray-500">Try changing your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div 
          key={item.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative"
        >
          {/* Actions Menu Button */}
          <div className="absolute top-2 left-2 z-30" ref={el => dropdownRefs.current[item.id] = el}>
            <button
              onClick={(e) => toggleActions(item.id, e)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              title="Actions"
            >
              <i className="fas fa-ellipsis-v text-gray-700"></i>
            </button>
            
            {/* Actions Dropdown */}
            {showActions[item.id] && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[160px] z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Edit button clicked for item:', item);
                    console.log('onEditItem function:', onEditItem);
                    setShowActions({});
                    if (onEditItem) {
                      onEditItem(item);
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                >
                  <i className="fas fa-edit text-blue-500"></i>
                  <span>Edit</span>
                </button>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Toggle availability clicked for item:', item.id);
                    console.log('onToggleAvailability function:', onToggleAvailability);
                    setShowActions({});
                    if (onToggleAvailability) {
                      onToggleAvailability(item.id);
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-yellow-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                >
                  <i className={`fas ${item.available ? 'fa-eye-slash text-yellow-500' : 'fa-eye text-green-500'}`}></i>
                  <span>{item.available ? 'Mark Unavailable' : 'Mark Available'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Delete button clicked for item:', item.id);
                    console.log('onDeleteItem function:', onDeleteItem);
                    setShowActions({});
                    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                      if (onDeleteItem) {
                        onDeleteItem(item.id);
                      }
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t border-gray-200 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden">
            <img 
              className="h-48 w-full object-cover" 
              src={item.image} 
              alt={item.name}
              onError={handleImageError}
            />
            {!item.available && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                item.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                {/* Diet labels */}
                <div className="flex gap-1 mt-1">
                  {item.isVegan && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" title="Vegan">
                      <i className="fas fa-seedling"></i> Vegan
                    </span>
                  )}
                  {item.isVegetarian && !item.isVegan && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full" title="Vegetarian">
                      <i className="fas fa-leaf"></i> Veg
                    </span>
                  )}
                  {item.spicyLevel && item.spicyLevel !== 'none' && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full" title={`Spicy: ${item.spicyLevel}`}>
                      🌶️ {item.spicyLevel}
                    </span>
                  )}
              </div>
            </div>
            <span className="text-orange-500 font-bold text-lg">{item.price} <i className="fa-solid fa-bangladeshi-taka-sign"></i></span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>            {/* Ingredients & Allergens */}
            {(item.ingredients?.length > 0 || item.allergens?.length > 0) && (
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                {item.ingredients?.length > 0 && (
                  <div className="flex gap-1 items-start">
                    <i className="fas fa-mortar-pestle mt-0.5"></i>
                    <span className="line-clamp-1">{item.ingredients.slice(0, 3).join(', ')}</span>
                  </div>
                )}
                {item.allergens?.length > 0 && (
                  <div className="flex gap-1 items-start text-red-600">
                    <i className="fas fa-exclamation-triangle mt-0.5"></i>
                    <span className="line-clamp-1">Allergens: {item.allergens.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <i className="fas fa-clock"></i>
                <span>{item.preparationTime} mins</span>
              </div>
              
              <button 
                onClick={() => onAddToCart(item)}
                disabled={!item.available}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  item.available
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.available ? (
                  <>
                    <i className="fas fa-plus mr-1"></i>
                    Add
                  </>
                ) : (
                  'Unavailable'
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
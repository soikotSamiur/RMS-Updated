import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const AddMenuItemModal = ({ isOpen, onClose, onItemAdded, onItemUpdated, editingItem, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image: '',
    preparationTime: '',
    available: true,
    ingredients: '',
    allergens: '',
    isVegetarian: false,
    isVegan: false,
    spicyLevel: 'none'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientSearchTerms, setIngredientSearchTerms] = useState({});

  // Fetch inventory items on mount
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await apiService.inventory.getInventory({ per_page: 1000 });
        if (response.success) {
          console.log('Fetched inventory items:', response.data);
          setInventoryItems(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching inventory items:', err);
      }
    };
    
    if (isOpen) {
      fetchInventoryItems();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    console.log('AddMenuItemModal useEffect - editingItem:', editingItem, 'isOpen:', isOpen);
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price || '',
        category: editingItem.category || 'appetizers',
        image: editingItem.image || '',
        preparationTime: editingItem.preparationTime || '',
        available: editingItem.available !== undefined ? editingItem.available : true,
        ingredients: editingItem.ingredients?.join(', ') || '',
        allergens: editingItem.allergens?.join(', ') || '',
        isVegetarian: editingItem.isVegetarian || false,
        isVegan: editingItem.isVegan || false,
        spicyLevel: editingItem.spicyLevel || 'none'
      });
      setImagePreview(editingItem.image || '');
      
      // Fetch ingredients for editing item
      if (editingItem.id) {
        fetchMenuItemIngredients(editingItem.id);
      }
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

  const fetchMenuItemIngredients = async (menuItemId) => {
    try {
      const response = await apiService.menu.getMenuItemIngredients(menuItemId);
      if (response.success && response.data.ingredients) {
        setSelectedIngredients(response.data.ingredients.map(ing => ({
          inventoryItemId: ing.id,
          name: ing.name,
          quantityRequired: ing.quantityRequired,
          unit: ing.unit
        })));
      }
    } catch (err) {
      console.error('Error fetching menu item ingredients:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
        setUploadingImage(false);
      };
      
      reader.onerror = () => {
        setError('Failed to read image file');
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Form submitted - editingItem:', editingItem);

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    try {
      setLoading(true);

      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || 'https://via.placeholder.com/400x300?text=No+Image',
        available: formData.available,
        preparationTime: parseInt(formData.preparationTime) || 10,
        ingredients: formData.ingredients.trim(),
        allergens: formData.allergens.trim(),
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        spicyLevel: formData.spicyLevel
      };

      console.log('Submitting item data:', itemData);

      let savedMenuItem;
      if (editingItem) {
        console.log('Calling onItemUpdated with id:', editingItem.id);
        savedMenuItem = await onItemUpdated(editingItem.id, itemData);
      } else {
        console.log('Calling onItemAdded');
        savedMenuItem = await onItemAdded(itemData);
      }

      // Save ingredients if menu item was created/updated successfully
      if (savedMenuItem && savedMenuItem.id && selectedIngredients.length > 0) {
        for (const ingredient of selectedIngredients) {
          try {
            await apiService.menu.addIngredientToMenuItem(savedMenuItem.id, {
              inventoryItemId: ingredient.inventoryItemId,
              quantityRequired: ingredient.quantityRequired
            });
          } catch (err) {
            console.error('Error adding ingredient:', err);
          }
        }
      }
      
      // Don't reset form here - let parent handle closing
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
      console.error('Error saving menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'appetizers',
      image: '',
      preparationTime: '',
      available: true,
      ingredients: '',
      allergens: '',
      isVegetarian: false,
      isVegan: false,
      spicyLevel: 'none'
    });
    setImagePreview('');
    setError(null);
    setSelectedIngredients([]);
    setIngredientSearchTerms({});
  };

  const handleAddIngredient = () => {
    const newIndex = selectedIngredients.length;
    setSelectedIngredients([...selectedIngredients, { inventoryItemId: '', name: '', quantityRequired: '', unit: '' }]);
    setIngredientSearchTerms(prev => ({ ...prev, [newIndex]: '' }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = selectedIngredients.filter((_, i) => i !== index);
    setSelectedIngredients(newIngredients);
    
    // Remove search term for this index
    const newSearchTerms = { ...ingredientSearchTerms };
    delete newSearchTerms[index];
    setIngredientSearchTerms(newSearchTerms);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...selectedIngredients];
    
    if (field === 'inventoryItemId') {
      const selectedItem = inventoryItems.find(item => item.id === parseInt(value));
      if (selectedItem) {
        newIngredients[index] = {
          ...newIngredients[index],
          inventoryItemId: selectedItem.id,
          name: selectedItem.name,
          unit: selectedItem.unit
        };
      }
    } else {
      newIngredients[index][field] = value;
    }
    
    setSelectedIngredients(newIngredients);
  };

  const handleIngredientSearchChange = (index, value) => {
    setIngredientSearchTerms(prev => ({ ...prev, [index]: value }));
  };

  const getFilteredInventoryItems = (index) => {
    const searchTerm = ingredientSearchTerms[index] || '';
    const availableItems = inventoryItems.filter(item => item.status !== 'out_of_stock');
    
    if (!searchTerm.trim()) {
      return availableItems;
    }
    
    return availableItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editingItem ? (
              <>
                <i className="fas fa-edit mr-2"></i>
                Edit Menu Item
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle mr-2"></i>
                Add New Menu Item
              </>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
              <i className="fas fa-exclamation-circle mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-orange-500"></i>
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="e.g., Grilled Salmon"
                      className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                      placeholder="e.g., 249"
                      className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe your dish..."
                    rows="3"
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="appetizers">Appetizers</option>
                          <option value="main-course">Main Course</option>
                          <option value="desserts">Desserts</option>
                          <option value="beverages">Beverages</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (mins)</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => handleFormChange('preparationTime', e.target.value)}
                      placeholder="e.g., 15"
                      className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-image text-orange-500"></i>
                Image
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {uploadingImage && (
                    <p className="text-sm text-orange-600 mt-1">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      Uploading...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or paste Image URL</label>
                  <input
                    type="url"
                    value={formData.image?.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => {
                      handleFormChange('image', e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.image?.startsWith('data:') && (
                    <p className="text-sm text-green-600 mt-1">
                      <i className="fas fa-check-circle mr-1"></i>
                      Image uploaded from device
                    </p>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        setError('Failed to load image');
                      }}
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-orange-500"></i>
                Inventory Ingredients (For Automatic Stock Deduction)
              </h3>
              
              <div className="space-y-4">
                {selectedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-white rounded-lg border border-gray-300">
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Inventory Item</label>
                      
                      {/* Search Input */}
                      <input
                        type="text"
                        value={ingredientSearchTerms[index] || ''}
                        onChange={(e) => handleIngredientSearchChange(index, e.target.value)}
                        placeholder="🔍 Search ingredients..."
                        className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      
                      {/* Dropdown with filtered results */}
                      <select
                        value={ingredient.inventoryItemId}
                        onChange={(e) => handleIngredientChange(index, 'inventoryItemId', e.target.value)}
                        className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">-- Select Ingredient --</option>
                        {getFilteredInventoryItems(index).map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} (Stock: {item.currentStock} {item.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qty Needed {ingredient.unit && <span className="text-orange-600">({ingredient.unit})</span>}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ingredient.quantityRequired}
                          onChange={(e) => handleIngredientChange(index, 'quantityRequired', e.target.value)}
                          placeholder="e.g., 0.5"
                          className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {ingredient.unit && (
                          <span className="absolute right-3 top-2 text-sm text-gray-500 font-medium">
                            {ingredient.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="mt-6 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="w-full px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  Add Ingredient from Inventory
                </button>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  <strong>Note:</strong> When this menu item is ordered, the specified quantities will be automatically deducted from inventory stock.
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-toggle-on text-orange-500"></i>
                Availability Status
              </h3>
              
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-300 w-fit">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => handleFormChange('available', e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1">
                  <i className="fas fa-check-circle text-green-500"></i>
                  Available
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">
                      <i className="fas fa-spinner"></i>
                    </span>
                    {editingItem ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${editingItem ? 'fa-save' : 'fa-plus'}`}></i>
                    {editingItem ? 'Update Item' : 'Add Item'}
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

export default AddMenuItemModal;

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
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

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

      if (editingItem) {
        console.log('Calling onItemUpdated with id:', editingItem.id);
        await onItemUpdated(editingItem.id, itemData);
      } else {
        console.log('Calling onItemAdded');
        await onItemAdded(itemData);
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
                Additional Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients
                    <span className="text-gray-500 text-xs ml-1">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => handleFormChange('ingredients', e.target.value)}
                    placeholder="e.g., Salmon, Herbs, Lemon, Butter"
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergens
                    <span className="text-gray-500 text-xs ml-1">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.allergens}
                    onChange={(e) => handleFormChange('allergens', e.target.value)}
                    placeholder="e.g., Fish, Dairy, Nuts"
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spicy Level</label>
                  <select
                    value={formData.spicyLevel}
                    onChange={(e) => handleFormChange('spicyLevel', e.target.value)}
                    className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="none">🟢 None</option>
                    <option value="mild">🟡 Mild</option>
                    <option value="medium">🟠 Medium</option>
                    <option value="hot">🔴 Hot</option>
                    <option value="extra-hot">🌶️ Extra Hot</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-300">
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

                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-300">
                    <input
                      type="checkbox"
                      id="vegetarian"
                      checked={formData.isVegetarian}
                      onChange={(e) => handleFormChange('isVegetarian', e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="vegetarian" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1">
                      <i className="fas fa-leaf text-green-600"></i>
                      Vegetarian
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-300">
                    <input
                      type="checkbox"
                      id="vegan"
                      checked={formData.isVegan}
                      onChange={(e) => handleFormChange('isVegan', e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="vegan" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1">
                      <i className="fas fa-seedling text-green-700"></i>
                      Vegan
                    </label>
                  </div>
                </div>
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

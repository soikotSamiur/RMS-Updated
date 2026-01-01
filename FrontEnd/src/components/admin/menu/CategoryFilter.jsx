const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <i className="fas fa-th-large text-orange-500"></i>
        Categories
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105 ring-2 ring-orange-300'
                : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md hover:scale-102'
            }`}
          >
            <i className={`${category.icon} text-lg`}></i>
            <span className="text-sm">{category.name}</span>
            {category.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
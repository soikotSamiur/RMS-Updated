const QuickActions = ({ searchQuery, setSearchQuery}) => {
  
  return (
    <div className="mb-6">
     
       {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 mt-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search menu items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-black"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" 
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
    
  );
};

export default QuickActions;
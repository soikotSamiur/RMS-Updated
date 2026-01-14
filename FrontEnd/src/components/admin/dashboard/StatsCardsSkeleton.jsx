const StatsCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-100 rounded-lg p-4 shadow-sm h-24 animate-pulse"></div>
      ))}
    </div>
  );
};

export default StatsCardsSkeleton;

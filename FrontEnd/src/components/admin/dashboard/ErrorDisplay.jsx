const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          <i className="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;

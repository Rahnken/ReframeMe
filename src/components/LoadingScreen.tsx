const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center space-x-2">
        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4.001 4.001 0 01-3.873-3.166L8 9.83V17.29z"
          />
        </svg>
        <span className="text-primary">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;

import { useState, useEffect } from "react";

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 50); // Adjust speed if needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black px-4">
      
      {/* Progress Bar Container */}
      <div className="relative w-full max-w-3xl h-6 bg-white rounded overflow-hidden">
        
        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Grim Reaper Icon */}
        <div
          className="absolute -top-10 transition-all duration-300"
          style={{
            left: `calc(${progress}% - 1rem)`,
          }}
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10"
            viewBox="0 0 24 24"
            fill="red"
          >
            <path d="M12 2c-.552 0-1 .448-1 1v7h-1V5.414l-1.293 1.293-1.414-1.414L10.586 2H12zM5 15c0 3.866 3.582 7 8 7s8-3.134 8-7H5z" />
          </svg>
        </div>

        {/* Person at Desk Icon */}
        <div className="absolute right-0 -top-10">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 18H5v-2h14v2zm0-4H5v-2h14v2zm0-4H5V10h14v2z" />
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-white text-sm sm:text-lg">
        Dead<span className="text-red-600">Line</span> {Math.min(progress, 100)}%
      </div>
    </div>
  );
};

export default Preloader;

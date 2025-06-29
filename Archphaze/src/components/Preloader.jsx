function Preloader() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-bounce animation-delay-150"></span>
        <span className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-bounce animation-delay-300"></span>
        <span className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-400 rounded-full animate-bounce"></span>
      </div>

      <style>{`
        .animation-delay-150 { animation-delay: 0.15s; }
        .animation-delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
export default Preloader;

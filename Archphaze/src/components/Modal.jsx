import React from 'react';

export default function Modal({ isOpen, onClose, title, content, image }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300">
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-xl max-h-[90vh] overflow-y-auto transition-all duration-300">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none transition cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        {/* Image in the middle */}
        {image && (
          <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="text-gray-700 text-base space-y-4 leading-relaxed">
          {Array.isArray(content)
            ? content.map((para, i) => <p key={i}>{para}</p>)
            : <p>{content}</p>}
        </div>
      </div>
    </div>
  );
}

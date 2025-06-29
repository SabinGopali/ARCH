import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function ProductDetail() {
  const location = useLocation();
  const { item, rect } = location.state || {};
  const imageRef = useRef(null);
  const [animating, setAnimating] = useState(!!rect);

  const product = {
    title: item?.title || "Headphones",
    price: "Rs.1178.00",
    images: {
      red: item?.image || "/archphaze.webp",
      white: item?.image || "/archphaze.webp",
      cyan: item?.image || "/archphaze.webp",
    },
    description:
      "Simple but cool. A blend of streetwear and minimalism. This piece combines bold color choices with clean lines for everyday confident wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["red", "white", "cyan"],
  };

  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedSize, setSelectedSize] = useState(null);
  const currentImage = product.images[selectedColor];

  useEffect(() => {
    // Check if animation already ran during this session
    const animationRan = sessionStorage.getItem("product-detail-animation-ran");

    if (rect && imageRef.current && !animationRan) {
      sessionStorage.setItem("product-detail-animation-ran", "true");

      const final = imageRef.current.getBoundingClientRect();

      const temp = document.createElement("img");
      temp.src = item.image;
      Object.assign(temp.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        objectFit: "cover",
        zIndex: 9999,
        borderRadius: "12px",
        transition: "none",
      });
      document.body.appendChild(temp);

      gsap.to(temp, {
        top: final.top,
        left: final.left,
        width: final.width,
        height: final.height,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          document.body.removeChild(temp);
          setAnimating(false);
        },
      });
    } else {
      // No animation, just show image immediately
      setAnimating(false);
    }
  }, [rect, item]);

  useEffect(() => {
    if (imageRef.current && !animating) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [selectedColor, animating]);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const cartItem = {
      id: item?.id || Math.random().toString(36).substr(2, 9),
      title: product.title,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: currentImage,
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (ci) =>
        ci.id === cartItem.id &&
        ci.color === cartItem.color &&
        ci.size === cartItem.size
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`Added ${product.title} (${selectedColor}, ${selectedSize}) to cart!`);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex justify-center items-center">
      <div className="bg-white max-w-6xl w-full rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              ref={imageRef}
              src={currentImage}
              alt={`${product.title} - ${selectedColor}`}
              className="w-full h-auto object-cover transition-all duration-300"
              style={{ opacity: animating ? 0 : 1 }}
            />
          </div>
        </div>

        <div className="p-8 w-full md:w-1/2">
          <h2 className="text-4xl font-extrabold mb-2 text-gray-900">
            {product.title}
          </h2>
          <p className="text-2xl text-gray-800 mb-4">{product.price}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">SELECT SIZES</h4>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded-md transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">SELECT COLOR</h4>
            <div className="flex gap-4">
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                    selectedColor === color ? "ring-4 ring-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <button
            onClick={addToCart}
            className="mt-4 w-full px-6 py-3 bg-white text-black border border-black rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

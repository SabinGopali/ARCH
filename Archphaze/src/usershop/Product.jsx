import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper function to get proper image URL
function getProductImageUrl(product) {
  let imageUrl = product.images?.[0] || product.image || "";

  if (!imageUrl) {
    return "https://via.placeholder.com/300";
  }

  // Replace backslashes with forward slashes
  imageUrl = imageUrl.replace(/\\/g, "/");

  // If not a full URL, prefix with localhost path
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
    imageUrl = `http://localhost:3000/${imageUrl}`;
  }

  return imageUrl;
}

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/backend/product/getall", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const visibleProducts = products.filter((p) => p.available === undefined || p.available);

  return (
    <section className="py-14 bg-gradient-to-b from-white to-gray-100">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 tracking-tight">
        <span className="inline-block w-12 h-[2px] bg-gray-800 align-middle mr-4 uppercase"></span>
        <span className="font-extrabold uppercase">Products</span>{" "}
        <span className="text-red-500 uppercase font-extrabold">Just for you</span>
        <span className="inline-block w-12 h-[2px] bg-gray-800 align-middle ml-4"></span>
      </h2>

      {loading ? (
        <div className="text-center py-12 text-lg">Loading...</div>
      ) : (
        <div className="px-8 sm:px-12 md:px-16 lg:px-28">
          {visibleProducts.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No products available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleProducts.map((product, index) => {
                const productImage = getProductImageUrl(product);
                const hasDiscount =
                  product.specialPrice > 0 && product.specialPrice < product.price;

                return (
                  <Link
                    key={product._id || index}
                    to={`/productdetail/${product._id}`}
                    className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 overflow-hidden"
                  >
                    <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.productName || product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300";
                        }}
                      />
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                          -{Math.round(((product.price - product.specialPrice) / product.price) * 100)}%
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col justify-between h-40">
                      <h3
                        title={product.productName || product.name}
                        className="text-gray-900 font-semibold text-md md:text-lg line-clamp-2 mb-2"
                      >
                        {product.productName || product.name}
                      </h3>

                      <div className="flex items-center space-x-3">
                        <span className="text-red-600 font-bold text-lg md:text-xl">
                          Rs. {(hasDiscount ? product.specialPrice : product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-sm md:text-base">
                            Rs. {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {product.stock !== undefined && (
                        <span
                          className={`inline-block mt-3 text-xs font-medium rounded-full px-2 py-1 ${
                            product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
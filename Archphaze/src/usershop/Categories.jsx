import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/backend/product/getall", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data && Array.isArray(data.products)) {
          products = data.products;
        }

        // Extract unique categories from available products only
        const uniqueCategories = [
          ...new Set(
            products
              .filter((p) => p.available === undefined || p.available)
              .map((product) => product.category)
          ),
        ];

        // Create category objects with slug
        const categoryObjects = uniqueCategories.map((category) => ({
          label: category,
          slug: category
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        }));

        setCategories(categoryObjects);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center text-red-500">
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center text-gray-500">
          <p>No categories found. Add some products to see categories here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Flip card styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

          .flip-card {
            perspective: 1000px;
          }
          .flip-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s;
          }
          .flip-card:hover .flip-inner {
            transform: rotateY(180deg);
          }
          .flip-front, .flip-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .flip-back {
            transform: rotateY(180deg);
            background-color: #f3f4f6;
          }
        `}
      </style>

      <h2 className="text-4xl text-center font-extrabold mb-6 text-gray-800 uppercase">
        Shop by <span className="text-red-500">Category</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="flip-card w-full h-48 cursor-pointer">
            <div className="flip-inner w-full h-full">
              {/* Front side */}
              <div className="flip-front bg-white border border-gray-100">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-bold shadow-md hover:scale-110 transition-transform duration-300 p-2 leading-tight">
                  <span
                    className="text-center"
                    style={{ fontFamily: "Pacifico, cursive", fontSize: "1rem" }}
                  >
                    {category.label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700 tracking-wide uppercase">
                  {category.label}
                </p>
              </div>

              {/* Back side */}
              <div className="flip-back">
                <p className="text-base font-semibold text-gray-700 mb-2">
                  Explore
                </p>
                <ul className="space-y-1 text-sm text-gray-600 mb-3">
                  <li>Details</li>
                  <li>New Arrivals</li>
                  <li>Top Picks</li>
                </ul>

                <Link
                  to={`/category/${category.slug}`}
                  className="relative inline-block text-sm font-semibold text-white px-5 py-2 rounded overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded opacity-80 group-hover:blur-sm transition-all duration-500"></span>
                  <span className="relative z-10">Go to Category</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

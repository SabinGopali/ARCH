import React, { useEffect, useState, useRef } from "react";
import { MdMenu } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    group: "Mobiles & Tablets",
    items: [
      "Mobiles",
      "Power Bank Skins",
      "Tablets",
      "Mobile Accessories",
      "Tablet Accessories",
    ],
  },
];

const priceRanges = [
  { label: "100 - 999 AED", id: "p1", min: 100, max: 999 },
  { label: "1000 - 1999 AED", id: "p2", min: 1000, max: 1999 },
  { label: "2000 - 2999 AED", id: "p3", min: 2000, max: 2999 },
];

const brands = ["Apple", "Samsung", "LG", "Xiaomi", "Sony", "Moto", "Google"];

const products = [
  {
    id: 1,
    name: "Google Pixel 2 XL White 128GB 4G LTE",
    price: 3042,
    originalPrice: 3202,
    discountPercent: 5,
    category: "Mobiles",
    brand: "Google",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/pixel2xl-white",
  },
  {
    id: 2,
    name: "P20 Pro Dual SIM Twilight 128GB 4G LTE",
    price: 2849,
    originalPrice: 2999,
    discountPercent: 5,
    category: "Mobiles",
    brand: "Samsung",
    image: "https://images.samsung.com/is/image/samsung/p20pro",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
  {
    id: 3,
    name: "iPhone X With FaceTime Silver 64GB 4G LTE",
    price: 3899,
    originalPrice: 4599,
    discountPercent: 16,
    category: "Mobiles",
    brand: "Apple",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-silver",
  },
];

const featuredProducts = [
  {
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
    title: "Redmi Note 5 Pro",
    description: "The phone was originally released in India last month",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    title: "Sony Wireless Headphones",
    description: "Noise-cancelling headphones with superior bass",
  },
  {
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=600&q=80",
    title: "iPad Mini 6",
    description: "Compact and powerful for your daily tasks",
  },
];

export default function Maincategories() {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("Mobiles");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Featured carousel
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Featured product auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex(
        (prev) => (prev + 1) % featuredProducts.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filtered products based on filters
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory)
      return false;
    if (
      selectedPrices.length > 0 &&
      !selectedPrices.some(
        ({ min, max }) => product.price >= min && product.price <= max
      )
    )
      return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
      return false;
    return true;
  });

  // Toggle filters
  const togglePrice = (priceRange) => {
    setSelectedPrices((prev) =>
      prev.find((p) => p.id === priceRange.id)
        ? prev.filter((p) => p.id !== priceRange.id)
        : [...prev, priceRange]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("Mobiles");
    setSelectedPrices([]);
    setSelectedBrands([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-1/2 left-0 -translate-y-1/2 bg-pink-600 text-white px-3 py-2 rounded-r-full shadow-lg z-40 lg:hidden hover:bg-pink-700 transition"
            aria-label="Open Filters"
          >
            <MdMenu className="w-5 h-5" />
          </button>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-white bg-opacity-90 border border-gray-200 rounded-r-xl shadow-lg p-6 w-64 transform top-20 z-30
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-700 bg-white shadow rounded-lg p-2 hover:bg-gray-100 transition"
            aria-label="Close Filters"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <h2 className="text-sm font-semibold text-gray-900 uppercase mb-5">
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="mb-6 bg-pink-600 text-white px-4 py-2 rounded w-full hover:bg-pink-700 transition"
          >
            Reset Filters
          </button>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Category
            </h3>
            {categories.map(({ group, items }) => (
              <div key={group} className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">{group}</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {items.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`cursor-pointer ${
                        selectedCategory === cat
                          ? "font-bold text-pink-600"
                          : "hover:text-pink-600"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Prices */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Price
            </h3>
            {priceRanges.map(({ label, id, min, max }) => (
              <label
                key={id}
                className="flex items-center space-x-3 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  checked={selectedPrices.some((p) => p.id === id)}
                  onChange={() => togglePrice({ label, id, min, max })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Brand
            </h3>
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-3 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm z-20 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          {/* Featured Product Carousel */}
          <div className="relative overflow-hidden bg-pink-100 rounded-xl px-6 py-10 mb-12 shadow-sm">
            <div className="flex items-center justify-center md:justify-start gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureIndex}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center gap-6 w-full"
                >
                  <img
                    src={featuredProducts[currentFeatureIndex].image}
                    alt={featuredProducts[currentFeatureIndex].title}
                    className="w-full max-w-xs md:max-w-sm object-contain rounded-lg shadow-md"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                      {featuredProducts[currentFeatureIndex].title}
                    </h2>
                    <p className="text-gray-700 mb-5 max-w-md">
                      {featuredProducts[currentFeatureIndex].description}
                    </p>
                    <button className="bg-white text-pink-600 font-semibold px-6 py-3 rounded shadow hover:bg-pink-50 transition duration-300">
                      BUY NOW
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Deals Header */}
          <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
            <h3 className="font-bold uppercase text-gray-900 tracking-wide text-lg sm:text-xl">
              Super Deals
            </h3>
          </div>

          {/* Products Grid - 5 cards in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
            {filteredProducts.length ? (
              filteredProducts.map((product) => {
                const discountPercent = Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                );

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                      />
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>

                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-500 transition truncate">
                        {product.name}
                      </h3>
                      <div className="mt-2 space-x-2 flex justify-center items-center">
                        <span className="text-xl font-bold text-red-500">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 p-10 w-full">
                No products found matching filters.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

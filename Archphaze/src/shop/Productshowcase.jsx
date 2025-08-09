import React, { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

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

// Fallback default products if needed
const defaultProducts = [];

function getProductImageUrl(product) {
  let imageUrl = product.images?.[0] || product.image || "";

  if (!imageUrl) {
    return "https://via.placeholder.com/300";
  }

  imageUrl = imageUrl.replace(/\\/g, "/");

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
    imageUrl = `http://localhost:3000/${imageUrl}`;
  }

  return imageUrl;
}

export default function Productshowcase() {
  const { currentUser } = useSelector((state) => state.user);

  const [storeProfile, setStoreProfile] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  // Sidebar filter data derived from backend products
  const [categories, setCategories] = useState([]); // [{ group, items: [] }]
  const [priceRanges, setPriceRanges] = useState([]); // [{ label, id, min, max }]
  const [brands, setBrands] = useState([]); // ["Apple", ...]

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Featured carousel index
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Fetch supplier, store profile, and products in parallel
  useEffect(() => {
    if (!currentUser?._id) return;
    let aborted = false;

    async function fetchAll() {
      setLoading(true);
      try {
        const [supRes, storeRes, prodRes] = await Promise.all([
          fetch("/backend/user/supplier-users", { credentials: "include" }),
          fetch(`/backend/store/get/${currentUser._id}`, { credentials: "include" }),
          fetch(`/backend/user/product/${currentUser._id}`, { credentials: "include" }),
        ]);

        const [supData, storeData, prodData] = await Promise.all([
          supRes.json().catch(() => ({})),
          storeRes.json().catch(() => ({})),
          prodRes.json().catch(() => ([])),
        ]);

        if (!aborted) {
          if (supRes.ok && supData) setSupplier(supData.supplier);
          else console.error(supData?.message || "Failed to fetch supplier");

          if (storeRes.ok && storeData) setStoreProfile(storeData.storeProfile);
          else console.error(storeData?.message || "Failed to fetch store profile");

          if (prodRes.ok) {
            if (Array.isArray(prodData)) setProducts(prodData);
            else if (prodData && Array.isArray(prodData.products)) setProducts(prodData.products);
            else setProducts(defaultProducts);
          } else {
            console.error("Failed to fetch products");
            setProducts(defaultProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!aborted) setProducts(defaultProducts);
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      aborted = true;
    };
  }, [currentUser?._id]);

  // Derive sidebar filter data (categories, brands, price ranges) from fetched products
  useEffect(() => {
    if (!products || products.length === 0) {
      setCategories([]);
      setBrands([]);
      setPriceRanges([]);
      return;
    }

    // Categories (unique by product.category)
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    setCategories([
      { group: "Categories", items: uniqueCategories },
    ]);

    // Brands (unique by product.brand)
    const uniqueBrands = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean))
    );
    setBrands(uniqueBrands);

    // Price ranges from product prices (use specialPrice if discounted)
    const prices = products
      .map((p) => {
        const base = Number(p.price);
        const special = Number(p.specialPrice);
        if (!isNaN(special) && special > 0 && special < base) return special;
        return base;
      })
      .filter((n) => !isNaN(n));

    if (prices.length === 0) {
      setPriceRanges([]);
      return;
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
      setPriceRanges([
        { label: `AED ${min.toLocaleString()}`, id: "p1", min, max },
      ]);
      return;
    }

    const bucketCount = 3;
    const stepRaw = (max - min) / bucketCount;
    // Round step to nearest 50 for cleaner ranges
    const step = Math.max(1, Math.round(stepRaw / 50) * 50);

    const ranges = Array.from({ length: bucketCount }, (_, i) => {
      const rMin = Math.round(min + i * step);
      const rMax = i === bucketCount - 1 ? Math.round(max) : Math.round(min + (i + 1) * step - 1);
      return {
        label: `${rMin.toLocaleString()} - ${rMax.toLocaleString()} AED`,
        id: `p${i + 1}`,
        min: rMin,
        max: rMax,
      };
    });

    setPriceRanges(ranges);
  }, [products]);

  // Featured carousel auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    setSelectedCategory("All");
    setSelectedPrices([]);
    setSelectedBrands([]);
  };

  // Filtering products with selected filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory && selectedCategory !== "All" && product.category !== selectedCategory)
      return false;

    // Price filter (use effective price if discounted)
    const effectivePrice =
      Number(product.specialPrice) > 0 && Number(product.specialPrice) < Number(product.price)
        ? Number(product.specialPrice)
        : Number(product.price);

    if (
      selectedPrices.length > 0 &&
      !selectedPrices.some(({ min, max }) => effectivePrice >= min && effectivePrice <= max)
    )
      return false;

    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

    return true;
  });

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative py-10 px-6 md:px-12 max-w-7xl mx-auto rounded-3xl shadow-lg mb-10 mt-10 overflow-hidden">
        <img
          src={
            storeProfile?.bgImage
              ? `http://localhost:3000/${storeProfile.bgImage}`
              : "https://via.placeholder.com/1200x300?text=Store+Banner"
          }
          alt="Store Banner"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/1200x300?text=Store+Banner";
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto bg-black/60 rounded-2xl px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={
                  storeProfile?.logo
                    ? `http://localhost:3000/${storeProfile.logo}`
                    : "https://via.placeholder.com/80x80?text=Logo"
                }
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-2xl md:text-3xl leading-snug">
                {supplier?.company_name || "Supplier Store"}
              </h1>
              <p className="text-white text-sm md:text-base opacity-90 mt-1">
                📍 {storeProfile?.city || "N/A"}, {storeProfile?.street || ""}
              </p>
              <p className="text-white text-sm md:text-base opacity-90">
                📧 {supplier?.email || "N/A"}
              </p>
            </div>
          </div>
          <Link to="/supplierproduct">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300">
              Back to Store
            </button>
          </Link>
        </div>
      </div>

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

          <h2 className="text-sm font-semibold text-gray-900 uppercase mb-5">Filters</h2>
          <button
            onClick={resetFilters}
            className="mb-6 bg-pink-600 text-white px-4 py-2 rounded w-full hover:bg-pink-700 transition"
          >
            Reset Filters
          </button>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">Category</h3>
            {categories.map(({ group, items }) => (
              <div key={group} className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">{group}</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {items.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`cursor-pointer ${
                        selectedCategory === cat ? "font-bold text-pink-600" : "hover:text-pink-600"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                  {/* Add an "All" option */}
                  <li
                    onClick={() => setSelectedCategory("All")}
                    className={`cursor-pointer ${
                      selectedCategory === "All" ? "font-bold text-pink-600" : "hover:text-pink-600"
                    }`}
                  >
                    All
                  </li>
                </ul>
              </div>
            ))}
          </div>

          {/* Prices */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">Price</h3>
            {priceRanges.map(({ label, id, min, max }) => (
              <label key={id} className="flex items-center space-x-3 cursor-pointer text-sm">
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
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">Brand</h3>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-3 cursor-pointer text-sm">
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

          {/* Products Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length ? (
              filteredProducts.map((product) => {
                const hasDiscount =
                  product.specialPrice > 0 && product.specialPrice < product.price;
                const productImage = getProductImageUrl(product);

                return (
                  <Link
                    key={product._id}
                    to={`/productdetail/${product._id}`}
                    className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-300 overflow-hidden"
                  >
                    <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.productName}
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
                        title={product.productName}
                        className="text-gray-900 font-semibold text-md md:text-lg line-clamp-2 mb-2"
                      >
                        {product.productName}
                      </h3>

                      <div className="flex items-center space-x-3">
                        <span className="text-red-600 font-bold text-lg md:text-xl">
                          AED {hasDiscount ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-sm md:text-base">
                            AED {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.stock !== undefined && (
                        <span
                          className={`inline-block mt-3 text-xs font-medium rounded-full px-2 py-1 ${
                            product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-center col-span-full text-gray-500 py-12">
                No products match your filters.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

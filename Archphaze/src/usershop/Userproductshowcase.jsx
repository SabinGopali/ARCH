import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

// Optional static fallback in case there are no products
const staticFeaturedFallback = [
  {
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
    title: "Featured Product",
    description: "Explore our latest arrivals and offers",
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

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function Userproductshowcase() {
  const { currentUser } = useSelector((state) => state.user);
  const { slug } = useParams();

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
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 160 : -160, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -160 : 160, opacity: 0 }),
  };

  const goToIndex = (idx) => {
    if (!featuredItems || featuredItems.length === 0) return;
    const bounded = ((idx % featuredItems.length) + featuredItems.length) % featuredItems.length;
    setDirection(bounded > currentFeatureIndex ? 1 : -1);
    setCurrentFeatureIndex(bounded);
    setProgress(0);
  };

  const goNext = () => {
    if (!featuredItems || featuredItems.length === 0) return;
    setDirection(1);
    setCurrentFeatureIndex((prev) => (prev + 1) % featuredItems.length);
    setProgress(0);
  };

  const goPrev = () => {
    if (!featuredItems || featuredItems.length === 0) return;
    setDirection(-1);
    setCurrentFeatureIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setProgress(0);
  };

  const swipeConfidenceThreshold = 50;

  // Compute featured items from fetched products (prefer highest discount)
  const featuredItems = React.useMemo(() => {
    if (!products || products.length === 0) return staticFeaturedFallback;
    const withDiscount = products.map((p) => {
      const price = Number(p.price) || 0;
      const special = Number(p.specialPrice) || 0;
      const discountValue = special > 0 && special < price ? price - special : 0;
      return { product: p, discountValue };
    });
    withDiscount.sort((a, b) => b.discountValue - a.discountValue);
    const top = (withDiscount[0]?.discountValue || 0) > 0 ? withDiscount : products.map((p) => ({ product: p, discountValue: 0 }));
    return top.slice(0, 5).map(({ product: p }) => ({
      image: getProductImageUrl(p),
      title: p.productName || p.name || "Product",
      description: p.brand ? `${p.brand}${p.category ? " • " + p.category : ""}` : p.category || "",
      id: p._id,
    }));
  }, [products]);

  // Fetch supplier, store profile, and products in parallel
  useEffect(() => {
    if (!currentUser?._id) return;
    let aborted = false;

    async function fetchAll() {
      setLoading(true);
      try {
        const [supRes, storeRes, prodRes] = await Promise.all([
          fetch("/backend/user/supplier-users", { credentials: "include" }),
          fetch(`/backend/store/getall/${currentUser._id}`, { credentials: "include" }),
          fetch(`/backend/product/getall`, { credentials: "include" }),
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

    // If a slug exists in URL, preselect the matching category label
    if (slug) {
      const match = uniqueCategories.find((cat) => slugify(cat) === slug);
      setSelectedCategory(match || "All");
    }

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
        { label: `Rs.  ${min.toLocaleString()}`, id: "p1", min, max },
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
        label: `${rMin.toLocaleString()} - ${rMax.toLocaleString()} Rs. `,
        id: `p${i + 1}`,
        min: rMin,
        max: rMax,
      };
    });

    setPriceRanges(ranges);
  }, [products, slug]);

  // Featured carousel auto-scroll using derived featuredItems
  useEffect(() => {
    if (!featuredItems || featuredItems.length <= 1) return;
    if (isCarouselHovered) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        const increment = 100 / (4000 / 50);
        const next = p + increment;
        if (next >= 100) {
          goNext();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [featuredItems?.length, isCarouselHovered]);

  // Ensure index is valid when featuredItems length changes
  useEffect(() => {
    if (!featuredItems || featuredItems.length === 0) {
      setCurrentFeatureIndex(0);
      return;
    }
    setCurrentFeatureIndex((prev) => prev % featuredItems.length);
  }, [featuredItems.length]);

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
      

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-1/2 left-0 -translate-y-1/2 bg-white text-black border border-black px-3 py-2 rounded-r-full shadow-lg z-40 lg:hidden hover:bg-black hover:text-white transition"
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
            className="mb-6 bg-white text-black border border-black px-4 py-2 rounded w-full hover:bg-black hover:text-white transition"
          >
            Reset Filters
          </button>

          {/* Categories */}
          <div className="mb-8">
            {categories.map(({ group, items }) => (
              <div key={group} className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">{group}</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  {items.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`cursor-pointer ${
                        selectedCategory === cat ? "font-bold text-black" : "hover:text-gray-700"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                  {/* Add an "All" option */}
                  <li
                    onClick={() => setSelectedCategory("All")}
                    className={`cursor-pointer ${
                      selectedCategory === "All" ? "font-bold text-black" : "hover:text-gray-700"
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
          <div
            className="relative overflow-hidden rounded-2xl mb-12 shadow-sm"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400" />
            <div className="relative px-6 py-10 sm:px-10">
              <button
                onClick={goPrev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full  text-pink-600 shadow hover:bg-white z-10"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={goNext}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full text-pink-600 shadow hover:bg-white z-10"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              <div className="flex items-stretch">
                <div className="w-full">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={currentFeatureIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -swipeConfidenceThreshold) goNext();
                        else if (info.offset.x > swipeConfidenceThreshold) goPrev();
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                    >
                      <div className="order-2 md:order-1 text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                          {featuredItems[currentFeatureIndex]?.title || "Featured Product"}
                        </h2>
                        <p className="text-white/90 mb-6 max-w-xl line-clamp-3">
                          {featuredItems[currentFeatureIndex]?.description || "Check out this product from our store."}
                        </p>
                        {featuredItems[currentFeatureIndex]?.id && (
                          <Link to={`/productdetail/${featuredItems[currentFeatureIndex].id}`}>
                            <button className="inline-flex items-center border border-white text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-black hover:border-black transition">
                              BUY NOW
                            </button>
                          </Link>
                        )}
                      </div>
                      <div className="order-1 md:order-2">
                        <div className="relative h-64 sm:h-72 md:h-80 bg-white/10 rounded-xl overflow-hidden ring-1 ring-white/20">
                          {featuredItems.length > 0 && (
                            <img
                              src={featuredItems[currentFeatureIndex]?.image}
                              alt={featuredItems[currentFeatureIndex]?.title || "Featured"}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/600x400?text=Product";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {featuredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${idx === currentFeatureIndex ? "bg-white ring-2 ring-white/40 scale-110" : "bg-white/50 hover:bg-white/80"}`}
                    />)
                  )}
                </div>
                <div className="relative h-1 w-36 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deals Header */}
          <div className="flex justify-center items-center mb-6 px-4 sm:px-0">
            <h2 className="text-3xl font-extrabold text-center mb-12 text-black tracking-tight">
                <span className="inline-block w-12 h-[2px] bg-black align-middle mr-4 uppercase"></span>
                <span className="font-extrabold uppercase">Super</span>{" "}
                <span className="text-red-500 uppercase font-extrabold">deals</span>
                <span className="inline-block w-12 h-[2px] bg-black align-middle ml-4"></span>
              </h2>
          </div>

          {/* Products Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length ? (
              filteredProducts.map((product) => {
                const hasDiscount =
                  product.specialPrice > 0 && product.specialPrice < product.price;
                const productImage = getProductImageUrl(product);

                return (
                  <Link
                    key={product._id}
                    to={`/productdetail/${product._id}`}
                    className="group block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 overflow-hidden"
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
                      <div className="absolute inset-0 bg-pink-50/0 group-hover:bg-pink-50/10 transition-colors" />
                    </div>

                    <div className="p-4 flex flex-col justify-between h-44">
                      <h3
                        title={product.productName}
                        className="text-gray-900 font-semibold text-md md:text-lg line-clamp-2 mb-1"
                      >
                        {product.productName}
                      </h3>
                      {product.brand && (
                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                      )}

                      <div className="flex items-baseline space-x-3">
                        <span className="text-red-600 font-bold text-lg md:text-xl">
                          Rs.  {hasDiscount ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-sm md:text-base">
                            Rs.  {product.price.toLocaleString()}
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
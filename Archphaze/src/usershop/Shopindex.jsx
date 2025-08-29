import React, { useState, useRef, useEffect } from "react";
import {
  FiArrowRight,
  FiSearch,
  FiX,
  FiTruck,
} from "react-icons/fi";
import { MdLocalShipping, MdWorkspacePremium } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Categories from "./Categories";
import Product from "./Product";
import img from '../assets/e-commerce.jpg';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



const whyShop = [
  {
    icon: <FiTruck size={30} />,
    title: "Fast Delivery",
    description:
      "Get your orders delivered within 1–2 days nationwide, with real-time tracking and no hidden charges",
  },
  {
    icon: <MdLocalShipping size={30} />,
    title: "Free Shipping",
    description:
      "Enjoy free delivery on all orders over $49 and hassle-free returns within 30 days—no questions asked.",
  },
  {
    icon: <MdWorkspacePremium size={30} />,
    title: "Best Quality",
    description:
      "We partner with trusted brands to bring you handpicked, durable, and verified products with warranty.",
  },
];

const Shopindex = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const whyRef = useRef(null);
  const productRef = useRef(null);

  // Search preview state
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  // Trusted stores (top 4)
  const [trustedStores, setTrustedStores] = useState([]);
  const [isFetchingStores, setIsFetchingStores] = useState(false);

  // Supplier/store profile state for Trusted section
  const { currentUser } = useSelector((state) => state.user);
  const [supplier, setSupplier] = useState(null);
  const [storeProfile, setStoreProfile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch trusted stores (limit 4)
  useEffect(() => {
    let aborted = false;
    async function fetchTrusted() {
      try {
        setIsFetchingStores(true);
        const res = await fetch(`/backend/store/public-list?limit=4`);
        const data = await res.json();
        if (!aborted && res.ok) setTrustedStores(Array.isArray(data?.stores) ? data.stores : []);
      } catch (_) {
        if (!aborted) setTrustedStores([]);
      } finally {
        if (!aborted) setIsFetchingStores(false);
      }
    }
    fetchTrusted();
    return () => { aborted = true; };
  }, []);

  // Lazy-load products for search preview (on first focus or when user types)
  useEffect(() => {
    const shouldFetch = !productsLoaded && !isFetchingProducts && (isFocused || searchTerm.length > 0);
    if (!shouldFetch) return;

    const fetchAllProducts = async () => {
      try {
        setIsFetchingProducts(true);
        const res = await fetch("/backend/product/getall", { credentials: "include" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
        const availableOnly = list.filter((p) => p.available === undefined || p.available);
        setProducts(availableOnly);
        setProductsLoaded(true);
      } catch (e) {
        setProducts([]);
        setProductsLoaded(true);
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchAllProducts();
  }, [isFocused, searchTerm, productsLoaded, isFetchingProducts]);

  // Fetch supplier and store profile to inject into Trusted section (kept in case needed elsewhere)
  useEffect(() => {
    let aborted = false;

    const fetchSupplier = async () => {
      try {
        const res = await fetch("/backend/user/supplier-users", { credentials: "include" });
        const data = await res.json();
        if (!aborted && res.ok) setSupplier(data?.supplier || null);
      } catch (_) {}
    };

    const fetchStoreProfile = async (ownerId) => {
      if (!ownerId) return;
      try {
        const res = await fetch(`/backend/store/get/${ownerId}`, { credentials: "include" });
        const data = await res.json();
        if (!aborted && res.ok) setStoreProfile(data?.storeProfile || null);
      } catch (_) {}
    };

    const supplierOwnerId = currentUser?.isSubUser ? (currentUser?.supplierId || currentUser?.supplierRef) : (currentUser?._id || currentUser?.id);
    if (supplierOwnerId) {
      fetchSupplier();
      fetchStoreProfile(supplierOwnerId);
    }

    return () => { aborted = true; };
  }, [currentUser]);

  // Helpers
  function getProductImageUrl(product) {
    let imageUrl = product?.images?.[0] || product?.image || "";
    if (!imageUrl) return "https://via.placeholder.com/300";
    imageUrl = imageUrl.replace(/\\/g, "/");
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
      imageUrl = `http://localhost:3000/${imageUrl}`;
    }
    return imageUrl;
  }

  function getStoreLogoUrl(logoPath) {
    if (!logoPath) return "https://via.placeholder.com/64";
    let path = String(logoPath).replace(/\\\\/g, '/').replace(/\\/g, '/');
    if (!path.startsWith('http://') && !path.startsWith('https://')) {
      if (path.startsWith('/')) path = path.slice(1);
      path = `http://localhost:3000/${path}`;
    }
    return path;
  }

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const previewResults = normalizedQuery
    ? products
        .filter((p) => {
          const name = String(p.productName || p.name || "").toLowerCase();
          const category = String(p.category || "").toLowerCase();
          return name.includes(normalizedQuery) || category.includes(normalizedQuery);
        })
        .slice(0, 8)
    : [];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen w-full bg-white px-8 sm:px-12 md:px-16 lg:px-28 py-12 flex items-center relative">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-full sm:max-w-xl lg:max-w-lg"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight uppercase">
              Everything You Need,
              <br />
              <span className="inline-block mt-3 bg-red-500 text-black px-4 py-2 rounded-full text-3xl sm:text-4xl md:text-5xl font-semibold">
                All in One Place
              </span>
            </h1>

            {/* Search Bar */}
            <div className="mt-6 w-full relative">
              <motion.div
                animate={{
                  scale: isFocused ? 1.03 : 1,
                  boxShadow: isFocused
                    ? "0 8px 15px rgba(0,0,0,0.15)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-gray-100 rounded-full px-4 sm:px-5 py-3 transition-all relative"
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    y: searchTerm ? [0, -4, 0] : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: searchTerm ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="text-gray-500 text-lg mr-3 flex-shrink-0"
                >
                  <FiSearch />
                </motion.div>

                <div className="relative flex-1">
                  <motion.label
                    htmlFor="search"
                    animate={{
                      top: isFocused || searchTerm ? "-1.1rem" : "0.5rem",
                      left: isFocused || searchTerm ? "0.5rem" : "1rem",
                      fontSize: isFocused || searchTerm ? "0.75rem" : "1rem",
                      color: isFocused ? "#111827" : "#6B7280",
                      backgroundColor:
                        isFocused || searchTerm ? "white" : "transparent",
                      padding: isFocused || searchTerm ? "0 0.25rem" : "0",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute pointer-events-none select-none rounded"
                  >
                    Search for products, brands, categories...
                  </motion.label>
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="bg-transparent w-full outline-none text-base pt-4 pb-2 pl-1 sm:text-lg"
                    autoComplete="off"
                  />
                  <motion.div
                    layoutId="underline"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[2px] bg-black absolute bottom-0 left-0 rounded"
                  />
                </div>

                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchTerm("")}
                      className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label="Clear search input"
                      type="button"
                    >
                      <FiX size={20} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Search Preview Dropdown */}
              <AnimatePresence>
                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                  >
                    <div className="max-h-80 overflow-auto">
                      {isFetchingProducts ? (
                        <div className="p-4 text-sm text-gray-500">Searching…</div>
                      ) : previewResults.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No results</div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {previewResults.map((p) => (
                            <li key={p._id} className="hover:bg-gray-50">
                              <Link
                                to={`/productdetail/${p._id}`}
                                className="flex items-center gap-3 p-3"
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <img
                                  src={getProductImageUrl(p)}
                                  alt={p.productName || p.name}
                                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/80";
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {p.productName || p.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {p.category || "General"}
                                  </p>
                                </div>
                                {typeof p.price === 'number' && (
                                  <span className="ml-auto text-sm font-semibold text-red-600">
                                    Rs. {(p.specialPrice > 0 && p.specialPrice < p.price ? p.specialPrice : p.price).toFixed(2)}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trusted by retailers */}
            <div className="mt-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                Trusted by Top Retailers
              </h3>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <AnimatePresence>
                  {trustedStores.map((s, idx) => (
                    <motion.div
                      key={String(s.userId)}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <Link to={`/store/${s.userId}`} className="flex items-center gap-2">
                        <img
                          src={getStoreLogoUrl(s.logo)}
                          alt={s.name || 'Store'}
                          className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-full bg-white border"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64';
                          }}
                        />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {s.name || 'Store'}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  {trustedStores.length === 0 && !isFetchingStores && (
                    <span className="text-xs text-gray-500">No stores yet</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              className="group mt-8 px-6 py-3 sm:px-8 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white font-semibold rounded-full flex items-center gap-3 shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-110 relative overflow-hidden text-sm sm:text-base"
              onClick={scrollToProducts}
            >
              <span className="relative z-10">Start Shopping</span>
              <FiArrowRight className="relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
            </motion.button>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 relative w-full max-w-full sm:max-w-3xl lg:max-w-5xl"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-[30px] overflow-hidden shadow-xl max-w-md mx-auto"
            >
              <img
                src={img}
                alt="E-commerce Showcase"
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Shop Section */}
      <section
        ref={whyRef}
        className="bg-[#f9fafb] py-16 px-6 sm:px-12 md:px-20 lg:px-28 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-gray-900 mb-2 uppercase"
        >
          Why <span className="text-red-500">Shop</span> With Us
        </motion.h2>

        <motion.div
          className="h-1 w-16 mx-auto rounded mb-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {whyShop.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-200 text-black p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="text-black mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm sm:text-base text-black">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Categories />

      {/* Product section wrapped with ref for scrolling */}
      <div ref={productRef}>
        <Product />
      </div>
    </>
  );
};

export default Shopindex;
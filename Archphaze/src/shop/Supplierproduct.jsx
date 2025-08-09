import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const categories = ["All", "Headphones", "Health", "Supplements", "Gadgets"];

// Default fallback products
const defaultProducts = [
  {
    productName: "P9 Wireless Stereo Headphones",
    price: 499,
    category: "Headphones",
    images: ["https://via.placeholder.com/300"],
    discount: "75% OFF",
    available: true,
  },
  {
    productName: "Jaiphal Oil",
    price: 300,
    category: "Health",
    images: ["https://via.placeholder.com/300"],
    available: true,
  },
  {
    productName: "Moringa Capsule 90",
    price: 461,
    category: "Supplements",
    images: ["https://via.placeholder.com/300"],
    available: true,
  },
  {
    productName: "Lapel Mic Set",
    price: 799,
    category: "Gadgets",
    images: ["https://via.placeholder.com/300"],
    available: true,
  },
  {
    productName: "Smart Watch",
    price: 1190,
    category: "Gadgets",
    images: ["https://via.placeholder.com/300"],
    available: true,
  },
];

export default function Supplierproduct() {
  const { currentUser } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeProfile, setStoreProfile] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!currentUser?._id) return;

    async function fetchData() {
      try {
        const supRes = await fetch("/backend/user/supplier-users", {
          credentials: "include",
        });
        const supData = await supRes.json();
        if (supRes.ok) setSupplier(supData.supplier);
        else console.error(supData.message);

        const storeRes = await fetch(`/backend/store/get/${currentUser._id}`, {
          credentials: "include",
        });
        const storeData = await storeRes.json();
        if (storeRes.ok) setStoreProfile(storeData.storeProfile);
        else console.error(storeData.message);
      } catch (error) {
        console.error("Error fetching store or supplier data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await fetch(`/backend/user/product/${currentUser._id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.log("No products found, using default products");
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(defaultProducts);
      }
    };
    fetchProducts();
  }, [currentUser?._id]);

  // Filter only available products + category + search
  const filteredProducts = products
    .filter((product) => product.available) // show only available
    .filter(
      (item) =>
        (selectedCategory === "All" || item.category === selectedCategory) &&
        (item.productName || item.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Store Header */}
      <div className="relative py-10 px-6 md:px-12 max-w-7xl mx-auto rounded-3xl shadow-lg mb-8 overflow-hidden">
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
            <div className="w-20 h-20 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center">
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
              <h1 className="text-white font-extrabold text-2xl md:text-3xl">
                {supplier?.company_name || "Supplier"}
              </h1>
              <p className="text-white text-sm md:text-base opacity-90 mt-1">
                📍 {storeProfile?.city || "Kathmandu"}, {storeProfile?.street || "Nepal"}
              </p>
              <p className="text-white text-sm md:text-base opacity-90">
                📧 {supplier?.email || "N/A"}
              </p>
            </div>
          </div>
          <Link to="/supplierprofileshop">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition">
              Check Store Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 px-6 md:px-12 border-b py-4 text-sm md:text-base font-medium max-w-7xl mx-auto">
        <button className="text-orange-600 border-b-2 border-orange-600 pb-1">Store</button>
        <Link to="/productshowcase">
          <button className="text-gray-500 hover:text-orange-500">Products</button>
        </Link>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-12 py-5 gap-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center border rounded-full px-3 py-1.5 w-full md:w-80 bg-white shadow-sm">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search In Store"
            className="ml-2 outline-none w-full bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Section */}
      <section className="py-14 bg-gradient-to-b from-white to-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 tracking-tight">
          <span className="inline-block w-12 h-[2px] bg-gray-800 align-middle mr-4 uppercase"></span>
          <span className="font-extrabold uppercase">Products</span>{" "}
          <span className="text-orange-500 uppercase font-extrabold">Just for you</span>
          <span className="inline-block w-12 h-[2px] bg-gray-800 align-middle ml-4"></span>
        </h2>

        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => {
                const hasDiscount =
                  product.specialPrice > 0 && product.specialPrice < product.price;
                const productImage = getProductImageUrl(product);

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
                        <span className="text-gray-400 line-through text-sm md:text-base">
                          Rs. {product.price.toFixed(2)}
                        </span>
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
      </section>
    </div>
  );
}

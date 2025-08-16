import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsShieldCheck, BsTruck, BsArrowReturnLeft } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, setCurrentUserId } from "../redux/cartSlice";

export default function ProductPage() {
  const { id: productId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantImages, setSelectedVariantImages] = useState({});
  const [selectedVariantChoices, setSelectedVariantChoices] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierName, setSupplierName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id;
      dispatch(setCurrentUserId(userId));
    }
  }, [currentUser, dispatch]);

  function getProductImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/600x600";
    let imageUrl = imagePath.replace(/\\/g, "/");
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
      imageUrl = `http://localhost:3000/${imageUrl}`;
    }
    return imageUrl;
  }

  useEffect(() => {
    async function fetchProductById() {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/backend/product/get/${productId}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
        const data = await res.json();
        setSelectedProduct(data);
        setSelectedImage(data.images?.[0] || "");
        setSelectedVariantImages({});
        setSelectedVariantChoices({});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductById();
  }, [productId]);

  useEffect(() => {
    async function fetchSupplierName() {
      if (!selectedProduct?.userRef) return;
      try {
        const res = await fetch(`/backend/store/public/${selectedProduct.userRef}`);
        const data = await res.json();
        if (res.ok) {
          setSupplierName(data?.supplier?.company_name || "Store");
        } else {
          setSupplierName("Store");
        }
      } catch {
        setSupplierName("Store");
      }
    }
    fetchSupplierName();
  }, [selectedProduct?.userRef]);

  const handleVariantImageClick = (variantIdx, image) => {
    setSelectedVariantImages((prev) => ({
      ...prev,
      [variantIdx]: getProductImageUrl(image),
    }));
    setSelectedImage(image);
  };

    const handleVariantSelectChange = (variantIdx, imagePath) => {
     if (!imagePath) {
       setSelectedVariantChoices((prev) => {
         const next = { ...prev };
         delete next[variantIdx];
         return next;
       });
       setSelectedVariantImages((prev) => {
         const next = { ...prev };
         delete next[variantIdx];
         return next;
       });
       return;
     }
     setSelectedVariantChoices((prev) => ({
       ...prev,
       [variantIdx]: imagePath,
     }));
     setSelectedVariantImages((prev) => ({
       ...prev,
       [variantIdx]: getProductImageUrl(imagePath),
     }));
     setSelectedImage(imagePath);
   };

  const hasDiscount =
    selectedProduct?.specialPrice > 0 &&
    selectedProduct?.specialPrice < selectedProduct?.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((selectedProduct.price - selectedProduct.specialPrice) /
          selectedProduct.price) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    if (!currentUser) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }
    if (!selectedProduct || selectedProduct.stock === 0) return;
    const userId = currentUser.id || currentUser._id;
    if (userId) dispatch(setCurrentUserId(userId));

    const cartItem = {
      productId: selectedProduct._id || selectedProduct.id,
      name: selectedProduct.productName,
      price: hasDiscount ? selectedProduct.specialPrice : selectedProduct.price,
      qty: quantity,
      image: selectedImage,
      variantImages: selectedVariantImages,
      selectedVariants: (selectedProduct.variants || [])
        .map((variant, idx) => ({ name: variant.name, image: selectedVariantImages[idx] }))
        .filter((v) => Boolean(v.image)),
      stock: selectedProduct.stock,
    };

    dispatch(addToCart(cartItem));
    alert(`${selectedProduct.productName} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      alert("Please log in to purchase.");
      navigate("/login");
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
        <div className="bg-gray-200 h-96 rounded-xl"></div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-xl font-semibold">Error: {error}</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="text-center py-20 text-gray-600">
        <h2 className="text-xl">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isActionDisabled = selectedProduct.stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Product Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={getProductImageUrl(selectedImage)}
              alt={selectedProduct.productName}
              className="w-full h-[500px] lg:h-[420px] object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.src = "https://via.placeholder.com/600x600")}
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {selectedProduct.images?.map((img, idx) => (
              <img
                key={idx}
                src={getProductImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-transform duration-300 ${
                  selectedImage === img
                    ? "ring-2 ring-blue-500 scale-110"
                    : "ring-1 ring-gray-200 hover:ring-gray-400"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Brand + Title */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                {selectedProduct.brand || "Unknown Brand"}
              </span>
              <span>•</span>
              <span>SKU: {selectedProduct.sku || "N/A"}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              {selectedProduct.productName}
            </h1>
          </div>

          {/* Variants */}
          {selectedProduct.variants?.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">Choose your variants (optional)</p>
              {selectedProduct.variants.map((variant, idx) => {
                const selectedRaw = selectedVariantChoices[idx] || "";
                const selectedUrl = selectedVariantImages[idx];
                return (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">{variant.name}</label>
                    <div className="flex items-center gap-3">
                      <select
                        className="border rounded-lg p-2 text-sm"
                        value={selectedRaw}
                        onChange={(e) => handleVariantSelectChange(idx, e.target.value)}
                      >
                        <option value="">{`Select ${variant.name}`}</option>
                        {variant.images?.map((img, i) => (
                          <option key={i} value={img}>{`Option ${i + 1}`}</option>
                        ))}
                      </select>
                      {selectedUrl && (
                        <img
                          src={selectedUrl}
                          alt={`${variant.name} selected`}
                          className="w-10 h-10 rounded object-cover ring-1 ring-gray-200"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Price + Stock */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {hasDiscount ? selectedProduct.specialPrice : selectedProduct.price}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  Rs. {selectedProduct.price}
                </span>
              )}
            </div>
            <span
              className={`text-sm font-semibold ${
                selectedProduct.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedProduct.stock > 0
                ? `In Stock (${selectedProduct.stock})`
                : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          {selectedProduct.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                {selectedProduct.description}
              </p>
            </div>
          )}

          {selectedProduct.warranty && (
            <details className="bg-gray-50 border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-900">Warranty</summary>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {selectedProduct.warranty.type === "No" ? (
                  <p>No warranty. Quality assured.</p>
                ) : (
                  <>
                    <p><span className="font-medium">Type:</span> {selectedProduct.warranty.type} Warranty</p>
                    {selectedProduct.warranty.period && (
                      <p><span className="font-medium">Period:</span> {selectedProduct.warranty.period}</p>
                    )}
                    {selectedProduct.warranty.policy && (
                      <p><span className="font-medium">Policy:</span> {selectedProduct.warranty.policy}</p>
                    )}
                  </>
                )}
              </div>
            </details>
          )}

          {/* Supplier Info */}
          {selectedProduct.userRef && (
            <div className="p-4 border rounded-lg flex items-center justify-between shadow-sm bg-gray-50">
              <div>
                <p className="text-sm text-gray-600">Sold by</p>
                <p className="text-base font-semibold">{supplierName}</p>
              </div>
              <Link to={`/supplierproduct/${selectedProduct.userRef}`}>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                  Visit Store
                </button>
              </Link>
            </div>
          )}

          {/* Quantity + Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-5 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={quantity >= selectedProduct.stock}
              >
                +
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={isActionDisabled}
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow ${
                  isActionDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <AiOutlineShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                disabled={isActionDisabled}
                onClick={handleBuyNow}
                className={`px-6 py-3 rounded-lg text-white font-semibold shadow ${
                  isActionDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Extra Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <BsTruck className="text-green-600" /> Free Shipping
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <BsArrowReturnLeft className="text-blue-600" /> Easy Returns
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <BsShieldCheck className="text-purple-600" />
              {selectedProduct.warranty?.type !== "No"
                ? `${selectedProduct.warranty.type} Warranty${selectedProduct.warranty.period ? " - " + selectedProduct.warranty.period : ""}`
                : "No Warranty"}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

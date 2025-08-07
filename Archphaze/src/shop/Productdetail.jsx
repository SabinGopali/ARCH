import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { BsShieldCheck, BsTruck, BsArrowReturnLeft } from "react-icons/bs";
import { FiStar } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, setCurrentUserId } from "../redux/cartSlice";

export default function ProductPage() {
  const { id: productId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantImages, setSelectedVariantImages] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set current user id in cart slice on user change
  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(setCurrentUserId(currentUser._id));
    }
  }, [currentUser, dispatch]);

  // Convert image path to full URL for frontend display
  function getProductImageUrl(imagePath) {
    if (!imagePath) return "https://via.placeholder.com/600x600";
    let imageUrl = imagePath.replace(/\\/g, "/");
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      if (imageUrl.startsWith("/")) imageUrl = imageUrl.slice(1);
      imageUrl = `http://localhost:3000/${imageUrl}`;
    }
    return imageUrl;
  }

  // Fetch product details by ID
  useEffect(() => {
    async function fetchProductById() {
      if (!productId) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/backend/product/get/${productId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setSelectedProduct(data);
        setSelectedImage(data.images?.[0] || "");

        // Setup initial variant images
        const initialVariantImages = {};
        data.variants?.forEach((variant, idx) => {
          const rawImage = variant.images?.[0] || "";
          initialVariantImages[idx] = getProductImageUrl(rawImage);
        });
        setSelectedVariantImages(initialVariantImages);
      } catch (err) {
        console.error("Error fetching product:", err);
        
        // For development: If backend is not available, use sample data
        if (err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
          console.warn("Backend not available, using sample data for development");
          const sampleProduct = {
            _id: productId,
            productName: "Sample Product",
            brand: "Sample Brand",
            sku: "SAMPLE001",
            price: 99.99,
            specialPrice: 79.99,
            stock: 10,
            images: ["/logo.webp"],
            variants: [],
            warranty: { type: "1 Year", period: "1 Year" }
          };
          setSelectedProduct(sampleProduct);
          setSelectedImage(sampleProduct.images[0]);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProductById();
  }, [productId]);

  // Variant image thumbnail click handler
  const handleVariantImageClick = (variantIdx, image) => {
    setSelectedVariantImages((prev) => ({
      ...prev,
      [variantIdx]: getProductImageUrl(image),
    }));
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

  // Add product to cart action, but only if logged in
  const handleAddToCart = () => {
    if (!currentUser) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    if (!selectedProduct || selectedProduct.stock === 0) return;

    const cartItem = {
      productId: selectedProduct._id || selectedProduct.id,
      name: selectedProduct.productName,
      price: hasDiscount ? selectedProduct.specialPrice : selectedProduct.price,
      qty: quantity,
      image: selectedImage,
      variantImages: selectedVariantImages,
      stock: selectedProduct.stock,
    };

    dispatch(addToCart(cartItem));
    
    // Show success message
    alert(`${selectedProduct.productName} added to cart!`);
  };

  // Buy now action with login check
  const handleBuyNow = () => {
    if (!currentUser) {
      alert("Please log in to purchase.");
      navigate("/login");
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  // Loading UI
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  // Error UI
  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error Loading Product</h2>
          <p className="text-red-600 mb-4">{error}</p>
          {!productId && (
            <div className="text-gray-600 text-sm">
              <p>Note: This page expects a product ID in the URL.</p>
              <p>Example: /productdetail/12345</p>
            </div>
          )}
          <button 
            onClick={() => navigate("/collection")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );

  // If product not found
  if (!selectedProduct)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Product not found
      </div>
    );

  // Disable buttons if no stock or no user logged in
  const isActionDisabled = selectedProduct.stock === 0 || !currentUser;

  // Main product UI
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={getProductImageUrl(selectedImage)}
              alt={selectedProduct.productName}
              className="w-full h-[500px] lg:h-[600px] object-cover"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{discountPercentage}%
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <AiOutlineHeart size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedProduct.images?.map((img, idx) => (
              <img
                key={idx}
                src={getProductImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 ${
                  selectedImage === img
                    ? "border-2 border-blue-500 scale-105"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                {selectedProduct.brand}
              </span>
              <span>•</span>
              <span>SKU: {selectedProduct.sku || "N/A"}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {selectedProduct.productName}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8) • 234 reviews</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                Rs. {hasDiscount ? selectedProduct.specialPrice : selectedProduct.price}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  Rs. {selectedProduct.price}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-medium ${
                  selectedProduct.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedProduct.stock > 0
                  ? `In Stock (${selectedProduct.stock} available)`
                  : "Out of Stock"}
              </span>
              {selectedProduct.stock > 0 && selectedProduct.stock <= 5 && (
                <span className="text-sm text-orange-600 font-medium">
                  Only {selectedProduct.stock} left!
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                type="button"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(selectedProduct.stock, quantity + 1))
                }
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {!currentUser && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                🔒 Please <button 
                  onClick={() => navigate("/login")} 
                  className="underline hover:text-yellow-900"
                >
                  sign in
                </button> to add items to your cart
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              disabled={isActionDisabled}
              onClick={handleAddToCart}
              type="button"
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-white transition-colors
                ${
                  isActionDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }
              `}
            >
              <AiOutlineShoppingCart size={20} />
              {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              disabled={isActionDisabled}
              onClick={handleBuyNow}
              type="button"
              className={`w-full px-6 py-4 rounded-lg text-white transition-colors
                ${
                  isActionDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BsTruck className="text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BsArrowReturnLeft className="text-blue-600" />
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BsShieldCheck className="text-purple-600" />
              <span>
                {selectedProduct.warranty?.type !== "No"
                  ? `${selectedProduct.warranty?.period} Warranty`
                  : "Quality Assured"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedProduct.variants?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-sm p-6 max-w-7xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Product Variants
          </h3>
          <div className="space-y-8">
            {selectedProduct.variants.map((variant, idx) => {
              const selectedVariantImageUrl = selectedVariantImages[idx];
              return (
                <div key={idx} className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800">{variant.name}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedVariantImageUrl && (
                      <div className="bg-gray-50 rounded-xl overflow-hidden">
                        <img
                          src={selectedVariantImageUrl}
                          alt={`Variant ${variant.name}`}
                          className="w-full h-64 md:h-80 object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Available Images:</h5>
                      <div className="flex flex-wrap gap-3">
                        {variant.images?.map((img, i) => {
                          const thumbUrl = getProductImageUrl(img);
                          const isSelected = selectedVariantImageUrl === thumbUrl;
                          return (
                            <img
                              key={i}
                              src={thumbUrl}
                              alt={`Variant Thumbnail ${i + 1}`}
                              onClick={() => handleVariantImageClick(idx, img)}
                              className={`w-16 h-16 rounded-lg object-cover cursor-pointer transition-all duration-300 ${
                                isSelected
                                  ? "border-2 border-blue-500 scale-105"
                                  : "border border-gray-200 hover:border-gray-300"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

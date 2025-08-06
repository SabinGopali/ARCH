import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { BsShieldCheck, BsTruck, BsArrowReturnLeft, BsBuilding } from "react-icons/bs";
import { FiStar } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const { id: productId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantImages, setSelectedVariantImages] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Fixed: Use the correct backend endpoint for fetching a single product
        const res = await fetch(`/backend/product/get/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setSelectedProduct(data);
        setSelectedImage(data.images?.[0] ?? "");

        const initialVariantImages = {};
        data.variants?.forEach((variant, idx) => {
          const rawImage = variant.images?.[0] || "";
          initialVariantImages[idx] = getProductImageUrl(rawImage);
        });
        setSelectedVariantImages(initialVariantImages);
      } catch (err) {
        console.error("Error fetching product by ID:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductById();
  }, [productId]);

  const handleVariantImageClick = (variantIdx, image) => {
    setSelectedVariantImages((prev) => ({
      ...prev,
      [variantIdx]: getProductImageUrl(image),
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">
            Error loading product
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Product not found</div>
        </div>
      </div>
    );
  }

  const hasDiscount =
    selectedProduct.specialPrice > 0 &&
    selectedProduct.specialPrice < selectedProduct.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((selectedProduct.price - selectedProduct.specialPrice) /
          selectedProduct.price) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Section */}
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

          {/* Product Details Section */}
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
                {selectedProduct.publisher && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BsBuilding size={12} />
                      {selectedProduct.publisher}
                    </span>
                  </>
                )}
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
                <span className="text-sm text-gray-600">
                  (4.8) • 234 reviews
                </span>
              </div>
            </div>

            {/* Company/Publisher Information Card */}
            {selectedProduct.publisher && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BsBuilding className="text-blue-600" size={16} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-blue-900">Published by</h3>
                    <p className="text-blue-800 font-medium">{selectedProduct.publisher}</p>
                    {selectedProduct.publisherDescription && (
                      <p className="text-sm text-blue-700">{selectedProduct.publisherDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedProduct.stock, quantity + 1))
                  }
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                disabled={selectedProduct.stock === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <AiOutlineShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                disabled={selectedProduct.stock === 0}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "publisher", label: "Publisher Info" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Description
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                />
                {selectedProduct.freeItems && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">
                      Free Items Included:
                    </h4>
                    <p className="text-green-700">{selectedProduct.freeItems}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600">{selectedProduct.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Brand:</span>
                      <span className="text-gray-600">{selectedProduct.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">SKU:</span>
                      <span className="text-gray-600">{selectedProduct.sku || "N/A"}</span>
                    </div>
                    {selectedProduct.publisher && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Publisher:</span>
                        <span className="text-gray-600">{selectedProduct.publisher}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Warranty Type:</span>
                      <span className="text-gray-600">{selectedProduct.warranty?.type || "No"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Warranty Period:</span>
                      <span className="text-gray-600">{selectedProduct.warranty?.period || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className="text-gray-600">{selectedProduct.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "publisher" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Publisher Information
                </h3>
                {selectedProduct.publisher ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BsBuilding className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedProduct.publisher}
                        </h4>
                        <p className="text-sm text-gray-600">Product Publisher</p>
                      </div>
                    </div>
                    
                    {selectedProduct.publisherDescription && (
                      <div className="prose prose-sm max-w-none text-gray-600">
                        <p>{selectedProduct.publisherDescription}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProduct.publisherWebsite && (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Website</h5>
                          <a 
                            href={selectedProduct.publisherWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            {selectedProduct.publisherWebsite}
                          </a>
                        </div>
                      )}
                      
                      {selectedProduct.publisherEmail && (
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Contact</h5>
                          <a 
                            href={`mailto:${selectedProduct.publisherEmail}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {selectedProduct.publisherEmail}
                          </a>
                        </div>
                      )}
                    </div>

                    {selectedProduct.publisherAddress && (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Address</h5>
                        <p className="text-sm text-gray-600">{selectedProduct.publisherAddress}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BsBuilding className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-500">No publisher information available for this product.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Variants Section */}
        {selectedProduct.variants?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 bg-white rounded-2xl shadow-sm p-6"
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
                                className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "border-blue-500 scale-105"
                                    : "border-gray-200 hover:border-gray-300"
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
    </div>
  );
}

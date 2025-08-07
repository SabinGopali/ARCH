import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { updateQty, removeFromCart, addToCart, setCurrentUserId } from "../redux/cartSlice";
import { Link } from "react-router-dom";

function getImageUrl(imagePath) {
  if (!imagePath) return "https://via.placeholder.com/96";
  let url = imagePath.replace(/\\/g, "/");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("/")) url = url.slice(1);
    url = `http://localhost:3000/${url}`;
  }
  return url;
}

export default function ShoppingCart() {
  const dispatch = useDispatch();
  
  // Get current user and cart state
  const currentUser = useSelector((state) => state.user?.currentUser);
  const currentUserId = useSelector((state) => state.cart?.currentUserId);
  const cartState = useSelector((state) => state.cart);
  
  // Get products from cart
  const products = useSelector((state) => {
    const cartsByUser = state.cart?.cartsByUser || {};
    const userId = state.cart?.currentUserId;
    return cartsByUser?.[userId] || [];
  });

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  const couponDiscountValue = 50;

  // Set current user ID when user changes
  useEffect(() => {
    if (currentUser && currentUser.id) {
      console.log('Setting currentUserId:', currentUser.id);
      dispatch(setCurrentUserId(currentUser.id));
    } else if (currentUser && currentUser._id) {
      console.log('Setting currentUserId:', currentUser._id);
      dispatch(setCurrentUserId(currentUser._id));
    } else if (!currentUser) {
      console.log('No user logged in, clearing currentUserId');
      dispatch(setCurrentUserId(null));
    }
  }, [currentUser, dispatch]);

  // Debug logging
  useEffect(() => {
    if (debugMode) {
      console.log('Cart Debug Info:', {
        currentUser,
        currentUserId,
        cartState,
        products,
        productsCount: products.length
      });
    }
  }, [currentUser, currentUserId, cartState, products, debugMode]);

  const toggleSelection = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateQuantity = (index, delta) => {
    const product = products[index];
    if (!product) return;

    const currentQty = Number(product.qty);
    if (isNaN(currentQty)) return;

    const newQty = Math.max(1, currentQty + delta);
    const maxQty = product.stock || 99;
    const finalQty = Math.min(newQty, maxQty);
    
    dispatch(updateQty({ productId: product.productId, qty: finalQty }));

    // Auto-select item when qty changes
    setSelectedIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const removeProduct = (index) => {
    const product = products[index];
    if (!product) return;

    if (window.confirm(`Remove ${product.name} from cart?`)) {
      dispatch(removeFromCart(product.productId));
      setSelectedIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const selectedProducts = products.filter((_, i) => selectedIndexes.includes(i));

  let rawTotalPrice = 0;
  for (const item of selectedProducts) {
    const price = Number(item.price);
    const qty = Number(item.qty);
    if (isNaN(price) || isNaN(qty)) continue;
    rawTotalPrice += price * qty;
  }

  const couponDiscount =
    selectedProducts.length > 0 && rawTotalPrice > couponDiscountValue
      ? couponDiscountValue
      : 0;

  const totalPrice = Math.max(0, rawTotalPrice - couponDiscount);

  // Function to add sample products for testing
  const addSampleProducts = () => {
    console.log('Adding sample products...');
    
    // If no user is logged in, create a test user ID
    if (!currentUserId) {
      const testUserId = 'test-user-' + Date.now();
      console.log('Creating test user ID:', testUserId);
      dispatch(setCurrentUserId(testUserId));
    }

    const sampleProducts = [
      {
        productId: 'sample1',
        name: 'Cute Worm Baby Toy',
        price: 450,
        qty: 1,
        image: '/logo.webp',
        stock: 10
      },
      {
        productId: 'sample2',
        name: 'Cute Crab Baby Toy',
        price: 355,
        qty: 1,
        image: '/logo.webp',
        stock: 5
      },
      {
        productId: 'sample3',
        name: 'Educational Building Blocks',
        price: 650,
        qty: 1,
        image: '/logo.webp',
        stock: 8
      }
    ];

    sampleProducts.forEach(product => {
      console.log('Adding product to cart:', product);
      dispatch(addToCart(product));
    });

    // Auto-select all added items after a delay
    setTimeout(() => {
      const newIndexes = Array.from({ length: sampleProducts.length }, (_, i) => i);
      setSelectedIndexes(newIndexes);
    }, 200);
  };

  const selectAllItems = () => {
    if (selectedIndexes.length === products.length) {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(products.map((_, idx) => idx));
    }
  };

  // Function to manually set a test user (for debugging)
  const setTestUser = () => {
    const testUserId = 'test-user-123';
    dispatch(setCurrentUserId(testUserId));
    console.log('Set test user ID:', testUserId);
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-12 py-8 text-black max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Shopping Cart</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
          <button
            onClick={setTestUser}
            className="px-3 py-1 text-xs bg-yellow-200 rounded hover:bg-yellow-300"
          >
            Set Test User
          </button>
        </div>
      </div>

      {/* Debug Information */}
      {debugMode && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <div className="space-y-1">
            <p><strong>Current User:</strong> {currentUser ? JSON.stringify({id: currentUser.id || currentUser._id, username: currentUser.username, email: currentUser.email}) : 'None'}</p>
            <p><strong>Current User ID in Cart:</strong> {currentUserId || 'None'}</p>
            <p><strong>Products in Cart:</strong> {products.length}</p>
            <p><strong>Cart State:</strong> {JSON.stringify(cartState, null, 2)}</p>
          </div>
        </div>
      )}

      {/* Show authentication and cart status */}
      <div className="mb-6 space-y-2">
        <div className="text-sm text-gray-600">
          {currentUser ? (
            <span className="text-green-600">✓ Signed in as: {currentUser.username || currentUser.email || 'User'}</span>
          ) : (
            <span className="text-orange-600">⚠ Please sign in to use the cart (or use test mode)</span>
          )}
        </div>
        
        {products.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Would you like to add some sample items for testing?</p>
            <button 
              onClick={addSampleProducts}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Sample Products
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              {selectedIndexes.length} of {products.length} item
              {products.length !== 1 ? "s" : ""} selected
            </div>
            <button
              onClick={selectAllItems}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {selectedIndexes.length === products.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3 space-y-6">
          {products.map((item, idx) => {
            const isSelected = selectedIndexes.includes(idx);
            const displayPrice = !isNaN(Number(item.price)) ? Number(item.price).toFixed(2) : "0.00";
            const displayQty = !isNaN(Number(item.qty)) ? Number(item.qty) : 1;
            const maxStock = item.stock || 99;
            
            return (
              <label
                key={item.productId}
                htmlFor={`checkbox-${idx}`}
                className={`group cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl transition relative ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:shadow-md hover:border-gray-400"
                }`}
              >
                <input
                  id={`checkbox-${idx}`}
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => toggleSelection(idx)}
                />

                <div className="flex items-center gap-5 w-full md:w-auto">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/96";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                    {item.stock && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col justify-between items-end gap-4 w-full md:w-auto min-w-[140px]">
                  <div className="text-right">
                    <p className="font-semibold text-lg">Rs. {displayPrice}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        className="w-8 h-8 rounded-l border-r text-lg font-bold disabled:opacity-40 transition hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, -1);
                        }}
                        aria-label="Decrease quantity"
                        disabled={displayQty === 1}
                        type="button"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-8 text-center py-2">{displayQty}</span>
                      <button
                        className="w-8 h-8 rounded-r border-l text-lg font-bold transition hover:bg-gray-50 disabled:opacity-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, 1);
                        }}
                        aria-label="Increase quantity"
                        disabled={displayQty >= maxStock}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProduct(idx);
                      }}
                      aria-label="Delete"
                      type="button"
                      className="text-gray-600 hover:text-red-600 transition p-1"
                    >
                      <MdDelete size={22} />
                    </button>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="w-full lg:w-1/3 space-y-8">
          <div className="border rounded-xl p-6 bg-white shadow-sm sticky top-4">
            <h4 className="font-semibold mb-5 text-lg">Price Details</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>
                  {selectedProducts.length} item
                  {selectedProducts.length !== 1 ? "s" : ""}
                </span>
                <span>Rs. {rawTotalPrice.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon discount</span>
                  <span>-Rs. {couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">Free Delivery</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              {selectedProducts.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Select items to see total price
                </p>
              )}
            </div>
          </div>
          
          {selectedProducts.length > 0 ? (
            <Link to="/checkout">
              <button
                className="w-full bg-black text-white py-4 rounded-lg text-sm font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-black"
                type="button"
              >
                Proceed to Checkout →
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg text-sm font-medium cursor-not-allowed"
              type="button"
            >
              Select items to checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUserId: null,
  cartsByUser: {}, // { userId1: [...items], userId2: [...items] }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCurrentUserId: (state, action) => {
      const userId = action.payload;
      
      // Validate userId
      if (userId && (typeof userId === 'string' || typeof userId === 'number')) {
        state.currentUserId = String(userId); // Ensure consistent string format
        
        // Ensure there's a cart array for this user
        if (!state.cartsByUser[state.currentUserId]) {
          state.cartsByUser[state.currentUserId] = [];
        }
      } else if (userId === null || userId === undefined) {
        // Allow clearing the current user
        state.currentUserId = null;
      }
    },
    
    addToCart: (state, action) => {
      const userId = state.currentUserId;
      if (!userId) {
        console.warn('Cannot add to cart: no user logged in');
        return;
      }

      const newItem = action.payload;
      
      // Validate required fields
      if (!newItem || !newItem.productId || !newItem.name || !newItem.price) {
        console.warn('Cannot add to cart: missing required fields', newItem);
        return;
      }

      // Ensure cart exists for user
      if (!state.cartsByUser[userId]) {
        state.cartsByUser[userId] = [];
      }

      const userCart = state.cartsByUser[userId];
      
      // Check if product already exists
      const existingItemIndex = userCart.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingItemIndex >= 0) {
        // If product already in cart, update quantity
        const currentQty = Number(userCart[existingItemIndex].qty) || 0;
        const addQty = Number(newItem.qty) || 1;
        const newQty = currentQty + addQty;
        
        // Check stock limit
        const stockLimit = newItem.stock || userCart[existingItemIndex].stock || 99;
        userCart[existingItemIndex].qty = Math.min(newQty, stockLimit);
        
        // Update other fields if provided
        if (newItem.price) userCart[existingItemIndex].price = newItem.price;
        if (newItem.image) userCart[existingItemIndex].image = newItem.image;
        if (newItem.stock !== undefined) userCart[existingItemIndex].stock = newItem.stock;
      } else {
        // Add new item to cart
        const cartItem = {
          productId: newItem.productId,
          name: newItem.name,
          price: Number(newItem.price) || 0,
          qty: Math.max(1, Number(newItem.qty) || 1),
          image: newItem.image || '',
          stock: newItem.stock || 99,
          variantImages: newItem.variantImages || {},
          addedAt: new Date().toISOString(),
        };
        
        userCart.push(cartItem);
      }
    },
    
    updateQty: (state, action) => {
      const { productId, qty } = action.payload;
      const userId = state.currentUserId;
      
      if (!userId) {
        console.warn('Cannot update quantity: no user logged in');
        return;
      }

      if (!productId || qty === undefined || qty < 1) {
        console.warn('Cannot update quantity: invalid data', action.payload);
        return;
      }

      const userCart = state.cartsByUser[userId] || [];
      const itemIndex = userCart.findIndex((item) => item.productId === productId);
      
      if (itemIndex >= 0) {
        const newQty = Math.max(1, Number(qty));
        const stockLimit = userCart[itemIndex].stock || 99;
        userCart[itemIndex].qty = Math.min(newQty, stockLimit);
      } else {
        console.warn('Cannot update quantity: item not found in cart', productId);
      }
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const userId = state.currentUserId;
      
      if (!userId) {
        console.warn('Cannot remove from cart: no user logged in');
        return;
      }

      if (!productId) {
        console.warn('Cannot remove from cart: no product ID provided');
        return;
      }

      if (state.cartsByUser[userId]) {
        const initialLength = state.cartsByUser[userId].length;
        state.cartsByUser[userId] = state.cartsByUser[userId].filter(
          (item) => item.productId !== productId
        );
        
        // Log if item wasn't found
        if (state.cartsByUser[userId].length === initialLength) {
          console.warn('Item not found in cart for removal:', productId);
        }
      }
    },
    
    clearCart: (state, action) => {
      const userIdToClear = action.payload || state.currentUserId;
      
      if (userIdToClear && state.cartsByUser[userIdToClear]) {
        state.cartsByUser[userIdToClear] = [];
      } else if (!userIdToClear) {
        console.warn('Cannot clear cart: no user specified');
      }
    },
    
    // New action to remove items that are out of stock
    removeOutOfStockItems: (state) => {
      const userId = state.currentUserId;
      if (!userId || !state.cartsByUser[userId]) return;
      
      state.cartsByUser[userId] = state.cartsByUser[userId].filter(
        (item) => item.stock > 0
      );
    },
    
    // New action to update item details (like price, stock) when product data changes
    updateItemDetails: (state, action) => {
      const { productId, updates } = action.payload;
      const userId = state.currentUserId;
      
      if (!userId || !productId || !updates) return;
      
      const userCart = state.cartsByUser[userId] || [];
      const itemIndex = userCart.findIndex((item) => item.productId === productId);
      
      if (itemIndex >= 0) {
        // Update allowed fields
        const allowedUpdates = ['price', 'name', 'image', 'stock'];
        allowedUpdates.forEach(field => {
          if (updates[field] !== undefined) {
            userCart[itemIndex][field] = updates[field];
          }
        });
        
        // Ensure quantity doesn't exceed new stock limit
        if (updates.stock !== undefined) {
          userCart[itemIndex].qty = Math.min(userCart[itemIndex].qty, updates.stock);
        }
      }
    },
  },
});

export const { 
  setCurrentUserId, 
  addToCart, 
  updateQty, 
  removeFromCart, 
  clearCart,
  removeOutOfStockItems,
  updateItemDetails
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors for easier data access
export const selectCartItems = (state) => {
  const userId = state.cart?.currentUserId;
  return state.cart?.cartsByUser?.[userId] || [];
};

export const selectCartItemCount = (state) => {
  const items = selectCartItems(state);
  return items.reduce((total, item) => total + (Number(item.qty) || 0), 0);
};

export const selectCartTotal = (state) => {
  const items = selectCartItems(state);
  return items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return total + (price * qty);
  }, 0);
};

export const selectCartItemById = (state, productId) => {
  const items = selectCartItems(state);
  return items.find(item => item.productId === productId);
};
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
      state.currentUserId = action.payload;
      // Ensure there's a cart array for this user
      if (state.currentUserId && !state.cartsByUser[state.currentUserId]) {
        state.cartsByUser[state.currentUserId] = [];
      }
    },
    addToCart: (state, action) => {
      const userId = state.currentUserId;
      if (!userId) return;

      const userCart = state.cartsByUser[userId] || [];

      // Check if product already exists
      const index = userCart.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (index >= 0) {
        // If product already in cart, update quantity
        userCart[index].qty += action.payload.qty;
      } else {
        userCart.push(action.payload);
      }

      state.cartsByUser[userId] = userCart;
    },
    updateQty: (state, action) => {
      const { productId, qty } = action.payload;
      const userId = state.currentUserId;
      if (!userId) return;

      const userCart = state.cartsByUser[userId] || [];
      const index = userCart.findIndex((item) => item.productId === productId);
      if (index >= 0) {
        userCart[index].qty = qty;
      }
      state.cartsByUser[userId] = userCart;
    },
    removeFromCart: (state, action) => {
      const userId = state.currentUserId;
      if (!userId) return;

      state.cartsByUser[userId] = state.cartsByUser[userId].filter(
        (item) => item.productId !== action.payload
      );
    },
    clearCart: (state) => {
      const userId = state.currentUserId;
      if (userId) {
        state.cartsByUser[userId] = [];
      }
    },
  },
});

export const { setCurrentUserId, addToCart, updateQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
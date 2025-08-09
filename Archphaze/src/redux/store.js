import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userslice';
import cartReducer from './cartSlice'; // adjust path as needed
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer, // add cart reducer here
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  // whitelist: ['user', 'cart'], // optionally whitelist slices to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables serializable checks for redux-persist
    }),
});

export const persistor = persistStore(store);

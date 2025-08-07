import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUserId } from '../redux/cartSlice';

const CartInitializer = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentUserId = useSelector((state) => state.cart.currentUserId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && currentUser._id && currentUserId !== currentUser._id) {
      // Set the current user ID in cart when user signs in
      dispatch(setCurrentUserId(currentUser._id));
    } else if (!currentUser && currentUserId) {
      // Clear the current user ID when user signs out
      dispatch(setCurrentUserId(null));
    }
  }, [currentUser, currentUserId, dispatch]);

  return null; // This component doesn't render anything
};

export default CartInitializer;
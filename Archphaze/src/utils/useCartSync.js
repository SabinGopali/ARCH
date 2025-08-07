import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUserId } from '../redux/cartSlice';

export const useCartSync = () => {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const cartUserId = useSelector((state) => state.cart?.currentUserId);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = currentUser?._id || currentUser?.id || null;
    
    // Only update if the user ID has changed
    if (cartUserId !== userId) {
      dispatch(setCurrentUserId(userId));
    }
  }, [currentUser, cartUserId, dispatch]);
};
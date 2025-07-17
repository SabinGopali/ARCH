import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Check if user is logged in and has admin privileges
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (!currentUser.isAdmin) {
    return <h1>you are not the admin</h1>; // or any route you want for forbidden access
  }

  return <Outlet />;
}
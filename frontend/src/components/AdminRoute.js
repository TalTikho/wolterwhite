import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const AdminRoute = ({ component }) => {
  const { username } = useAuthContext();

  // Redirect to home if not logged in or not an admin
  if (!username || username !== 'admin1') {
     <Navigate to="/" replace />;
  }

  return component;
};
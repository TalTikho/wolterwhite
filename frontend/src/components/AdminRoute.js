import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const AdminRoute = ({ component }) => {
  const { user } = useAuthContext();

  // Redirect to home if not logged in or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  return component;
};
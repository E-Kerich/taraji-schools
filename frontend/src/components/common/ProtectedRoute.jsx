import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;

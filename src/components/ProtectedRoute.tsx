import { Navigate, useLocation } from 'react-router-dom';
import { storage } from '../utils/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = storage.getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

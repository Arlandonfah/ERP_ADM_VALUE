import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ReactNode } from 'react';


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true }); 
    }
  }, [isAuthenticated, loading, navigate]);


  if (loading) {
    return <p>Chargement...</p>;
  }


  return <>{children}</>;
};

export default ProtectedRoute;
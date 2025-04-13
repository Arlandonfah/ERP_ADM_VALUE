import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);


  const checkAuth = () => {


    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    navigate('/employees'); 
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); 
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, loading, login, logout };
};
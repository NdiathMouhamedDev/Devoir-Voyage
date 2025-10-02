// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Initialiser user ET token depuis localStorage dès le début
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configurer axios par défaut
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ✅ Vérifier le token au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔍 Vérification auth:', { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser 
      });

      if (storedToken) {
        try {
          // Configurer le header avant l'appel
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await api.get('/user');
          console.log('✅ User récupéré:', response.data);
          
          setUser(response.data);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('❌ Token invalide:', error.response?.data || error.message);
          // Token invalide, nettoyer tout
          logout();
        }
      } else if (storedUser) {
        // On a un user mais pas de token (cas rare)
        console.log('⚠️ User sans token, on utilise les données en cache');
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []); // ✅ Exécuter UNE SEULE FOIS au montage

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token: access_token, user: userData } = response.data;
      
      console.log('✅ Login réussi:', { user: userData, hasToken: !!access_token });
      
      // Sauvegarder immédiatement
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Mettre à jour les états
      setToken(access_token);
      setUser(userData);
      
      // ✅ Configurer axios immédiatement
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion...');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    const result = user?.role === 'admin';
    console.log('🔐 isAdmin?', result, 'role:', user?.role);
    return result;
  };

  const isAuthenticated = () => {
    const result = !!user && !!token;
    console.log('🔑 isAuthenticated?', result, { hasUser: !!user, hasToken: !!token });
    return result;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
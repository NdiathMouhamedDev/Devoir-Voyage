// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import api from '../api';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Provider d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configurer axios par défaut
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Vérifier le token au chargement
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    console.error('Token invalide:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', {
                email,
                password
            });

            const { access_token, user: userData } = response.data;
            
            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Erreur de connexion' 
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isAuthenticated = () => {
        return !!user && !!token;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour utiliser l'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
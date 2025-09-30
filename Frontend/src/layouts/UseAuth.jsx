// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
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

                    // 🔒 synchro avec localStorage
                    localStorage.setItem('user', JSON.stringify(response.data));
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
            const response = await api.post('/login', { email, password });

            const { token: access_token, user: userData } = response.data;

            setToken(access_token);
            setUser(userData);

            // 🔒 Sauvegarder token + user
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

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
        localStorage.removeItem('user');
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

// Dashboard.jsx avec useAuth
import React, { useState } from 'react';
import { useAuth } from '../layouts/UseAuth';
import RegisterEvent from '../layouts/RegisterEvent';
import AvatarMenu from '../components/miniComponents/AvatarMenu';
import EventManagement from '../layouts/EventManagement'; // Importer le nouveau composant
// import Stats from '../layouts/Stats';
// import Hourly from '../layouts/Hourly';
import { useNavigate } from 'react-router-dom';
import DeconnexionBtn from '../components/miniComponents/DeconnexionBTN';

const Dashboard = () => {
    const { user, isAdmin, isAuthenticated, loading, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('overview'); // État pour gérer les sections
    const navigate = useNavigate()


    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div>⏳</div>
                <div>Chargement...</div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                maxWidth: '500px',
                margin: '2rem auto'
            }}>
                <h2>🔒 Authentification requise</h2>
                <p>Vous devez vous connecter pour accéder à cette page.</p>
                <button 
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                    }}
                >
                    Se connecter
                </button>
            </div>
        );
    }

    if (!isAdmin()) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                maxWidth: '500px',
                margin: '2rem auto',
                border: '1px solid #fca5a5',
                borderRadius: '0.5rem',
                backgroundColor: '#fef2f2'
            }}>
                <h2>🚫 Accès Refusé</h2>
                <p style={{ color: '#dc2626' }}>
                    Seuls les administrateurs peuvent accéder au dashboard.
                </p>
                <p>Votre rôle actuel : <strong>{user.role}</strong></p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                        }}
                    >
                        Retour à l'accueil
                    </button>
                    
                    <DeconnexionBtn />
                </div>
            </div>
        );
    }

    // Fonction pour rendre le contenu selon la section active
    const renderContent = () => {
        switch (activeSection) {
            case 'events':
                return <EventManagement />;
            case 'create-event':
                return <RegisterEvent />;
            case 'overview':
            default:
                return (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <div style={{ 
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h3 style={{ marginTop: 0 }}>📅 Événements</h3>
                            <p>Créez et gérez les événements</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={() => setActiveSection('events')}
                                    style={{ 
                                        padding: '0.5rem 1rem', 
                                        backgroundColor: '#f59e0b', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📋 Liste des événements
                                </button>
                                <button 
                                    onClick={() => setActiveSection('create-event')}
                                    style={{ 
                                        padding: '0.5rem 1rem', 
                                        backgroundColor: '#10b981', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ➕ Créer un événement
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header du dashboard */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1f2937' }}>
                        🎛️ Dashboard Administrateur
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                        Bienvenue <strong>{user.name}</strong> !
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AvatarMenu />
                    <DeconnexionBtn />
                </div>
            </div>

            {/* Navigation */}
            {activeSection !== 'overview' && (
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveSection('overview')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        ← Retour au dashboard
                    </button>
                </div>
            )}

            {/* Contenu principal */}
            {renderContent()}

            {/* Section debug */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ 
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem'
                }}>
                    <details>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            Debug Info
                        </summary>
                        <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                            {JSON.stringify({
                                user: user,
                                isAdmin: isAdmin(),
                                isAuthenticated: isAuthenticated(),
                                activeSection: activeSection
                            }, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
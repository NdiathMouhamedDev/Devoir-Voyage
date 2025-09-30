import React, { useState } from 'react';
import { useAuth } from '../layouts/UseAuth';
import RegisterEvent from '../layouts/RegisterEvent';
import AvatarMenu from '../components/miniComponents/AvatarMenu';
import EventManagement from '../layouts/EventManagement';
import { useNavigate } from 'react-router-dom';
import DeconnexionBtn from '../components/miniComponents/DeconnexionBTN';

const Dashboard = () => {
    const { user, isAdmin, isAuthenticated, loading, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center space-y-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <div className="text-base-content text-lg">Chargement...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        navigate('/');
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
                
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="card-title justify-center text-2xl">Authentification requise</h2>
                        <p className="text-base-content/70">
                            Vous devez vous connecter pour accéder à cette page.
                        </p>
                        <div className="card-actions justify-center mt-4">
                            <button 
                                onClick={() => navigate('/login')}
                                className="btn btn-primary btn-wide"
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
                <div className="card w-full max-w-md bg-base-100 shadow-xl border-2 border-error">
                    <div className="card-body text-center">
                        <div className="text-6xl mb-4">🚫</div>
                        <h2 className="card-title justify-center text-2xl text-error">Accès Refusé</h2>
                        <div className="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Seuls les administrateurs peuvent accéder au dashboard.</span>
                        </div>
                        <div className="badge badge-outline badge-lg mt-2">
                            Votre rôle : <strong className="ml-2">{user.role}</strong>
                        </div>
                        <div className="card-actions justify-center mt-4 gap-2">
                            <button 
                                onClick={() => navigate('/')}
                                className="btn btn-neutral"
                            >
                                Retour à l'accueil
                            </button>
                            <DeconnexionBtn />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'events':
                return <EventManagement />;
            case 'create-event':
                return <RegisterEvent />;
            case 'overview':
            default:
                return (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                                <div className="stat-figure text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Événements</div>
                                <div className="stat-value text-primary">24</div>
                                <div className="stat-desc">↗︎ 12% ce mois</div>
                            </div>

                            <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                                <div className="stat-figure text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Participants</div>
                                <div className="stat-value text-secondary">1,846</div>
                                <div className="stat-desc">↗︎ 22% ce mois</div>
                            </div>

                            <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                                <div className="stat-figure text-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Revenus</div>
                                <div className="stat-value text-accent">45K €</div>
                                <div className="stat-desc">↗︎ 18% ce mois</div>
                            </div>

                            <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                                <div className="stat-figure text-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Satisfaction</div>
                                <div className="stat-value text-success">97%</div>
                                <div className="stat-desc">↗︎ 3% ce mois</div>
                            </div>
                        </div>

                        {/* Quick Actions Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-5xl">📅</div>
                                        <h2 className="card-title text-2xl">Événements</h2>
                                    </div>
                                    <p className="opacity-90 mb-4">Créez et gérez tous vos événements en un seul endroit</p>
                                    <div className="card-actions flex-wrap gap-2">
                                        <button 
                                            onClick={() => setActiveSection('events')}
                                            className="btn btn-warning gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Liste des événements
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('create-event')}
                                            className="btn btn-success gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Créer un événement
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-5xl">📊</div>
                                        <h2 className="card-title text-2xl">Analytics</h2>
                                    </div>
                                    <p className="opacity-90 mb-4">Suivez les performances et les statistiques détaillées</p>
                                    <div className="card-actions">
                                        <button className="btn btn-accent gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Voir les statistiques
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Activité récente
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { icon: '✅', text: 'Nouvel événement créé', time: 'Il y a 2 heures', badge: 'success' },
                                        { icon: '👤', text: '15 nouvelles inscriptions', time: 'Il y a 3 heures', badge: 'info' },
                                        { icon: '💰', text: 'Paiement reçu: 250€', time: 'Il y a 5 heures', badge: 'warning' },
                                        { icon: '📧', text: 'Email de confirmation envoyé', time: 'Il y a 1 jour', badge: 'neutral' }
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{activity.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-base-content">{activity.text}</p>
                                                    <p className="text-sm text-base-content/60">{activity.time}</p>
                                                </div>
                                            </div>
                                            <div className={`badge badge-${activity.badge}`}>Nouveau</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                                    <span className="text-primary">🎛️</span>
                                    Dashboard Administrateur
                                </h1>
                                <p className="text-base-content/70 mt-2">
                                    Bienvenue <span className="font-semibold text-primary">{user.name}</span> !
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <AvatarMenu />
                                <DeconnexionBtn />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Navigation */}
                {activeSection !== 'overview' && (
                    <div className="text-sm breadcrumbs mb-4">
                        <ul>
                            <li>
                                <button onClick={() => setActiveSection('overview')} className="btn btn-ghost btn-sm gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Dashboard
                                </button>
                            </li>
                            <li className="text-primary font-semibold">
                                {activeSection === 'events' ? 'Gestion des événements' : 'Créer un événement'}
                            </li>
                        </ul>
                    </div>
                )}

                {/* Main Content */}
                {renderContent()}

                {/* Debug Section */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="card bg-base-100 shadow-lg mt-6">
                        <div className="card-body">
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="checkbox" /> 
                                <div className="collapse-title font-bold">
                                    🐛 Debug Info
                                </div>
                                <div className="collapse-content">
                                    <pre className="text-xs overflow-auto bg-base-300 p-4 rounded-lg">
                                        {JSON.stringify({
                                            user: user,
                                            isAdmin: isAdmin(),
                                            isAuthenticated: isAuthenticated(),
                                            activeSection: activeSection
                                        }, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
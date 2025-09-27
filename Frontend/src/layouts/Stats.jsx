import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30'); // 30 jours par défaut

    // Données mockées pour la démonstration - à remplacer par vos vraies données API
    const mockStats = {
        events: {
            total: 156,
            active: 42,
            past: 98,
            cancelled: 16,
            topEvents: [
                { name: "Concert Jazz Festival", interested: 2847, date: "2025-10-15" },
                { name: "Workshop React.js", interested: 1923, date: "2025-11-20" },
                { name: "Expo Photo Nature", interested: 1756, date: "2025-12-03" },
                { name: "Conférence IA", interested: 1432, date: "2025-10-28" },
                { name: "Marathon Ville", interested: 1289, date: "2025-11-12" }
            ],
            monthlyCreations: [
                { month: 'Jan', events: 12 },
                { month: 'Fév', events: 19 },
                { month: 'Mar', events: 15 },
                { month: 'Avr', events: 22 },
                { month: 'Mai', events: 18 },
                { month: 'Jun', events: 25 },
                { month: 'Jul', events: 28 },
                { month: 'Aoû', events: 31 },
                { month: 'Sep', events: 24 }
            ]
        },
        users: {
            total: 3247,
            newThisWeek: 47,
            newThisMonth: 186,
            roleDistribution: [
                { role: 'Users', count: 3189, color: '#3b82f6' },
                { role: 'Admins', count: 58, color: '#ef4444' }
            ],
            weeklyGrowth: [
                { week: 'S-4', users: 145 },
                { week: 'S-3', users: 162 },
                { week: 'S-2', users: 178 },
                { week: 'S-1', users: 194 },
                { week: 'S0', users: 186 }
            ]
        },
        interactions: {
            totalLikes: 45672,
            averagePerEvent: 293,
            engagementTrend: [
                { date: '01/09', likes: 1234 },
                { date: '08/09', likes: 1456 },
                { date: '15/09', likes: 1678 },
                { date: '22/09', likes: 1923 },
                { date: '29/09', likes: 2145 }
            ]
        }
    };

    useEffect(() => {
        // Simuler le chargement des données
        const loadStats = async () => {
            setLoading(true);
            // Ici vous feriez l'appel à votre API
            // const statsData = await fetchDashboardStats();
            setTimeout(() => {
                setStats(mockStats);
                setLoading(false);
            }, 1000);
        };

        loadStats();
    }, [timeRange]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '2rem' }}>📊</div>
                <div>Chargement des statistiques...</div>
            </div>
        );
    }

    const StatCard = ({ icon, title, value, subtitle, color = '#3b82f6', trend = null }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: color
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                        <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                            {title}
                        </h3>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {value}
                    </div>
                    {subtitle && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {subtitle}
                        </div>
                    )}
                </div>
                {trend && (
                    <div style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: trend > 0 ? '#dcfce7' : '#fee2e2',
                        color: trend > 0 ? '#16a34a' : '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}>
                        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1f2937' }}>📊 Statistiques & Analytics</h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                        Vue d'ensemble de l'activité de la plateforme
                    </p>
                </div>
                
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="7">7 derniers jours</option>
                    <option value="30">30 derniers jours</option>
                    <option value="90">3 derniers mois</option>
                    <option value="365">1 an</option>
                </select>
            </div>

            {/* KPIs principaux */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    icon="📅"
                    title="Événements Total"
                    value={stats.events.total}
                    subtitle={`${stats.events.active} actifs • ${stats.events.past} passés`}
                    color="#3b82f6"
                    trend={12}
                />
                <StatCard
                    icon="👥"
                    title="Utilisateurs Total"
                    value={stats.users.total.toLocaleString()}
                    subtitle={`+${stats.users.newThisMonth} ce mois`}
                    color="#10b981"
                    trend={8}
                />
                <StatCard
                    icon="❤️"
                    title="Total Intérêts"
                    value={stats.interactions.totalLikes.toLocaleString()}
                    subtitle={`Moy. ${stats.interactions.averagePerEvent} par événement`}
                    color="#f59e0b"
                    trend={15}
                />
                <StatCard
                    icon="📈"
                    title="Taux Engagement"
                    value="87%"
                    subtitle="Interaction moyenne utilisateurs"
                    color="#8b5cf6"
                    trend={5}
                />
            </div>

            {/* Graphiques principaux */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Évolution création événements */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>📈 Création d'événements par mois</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.events.monthlyCreations}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.375rem'
                                }}
                            />
                            <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Évolution engagement */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>💖 Évolution de l'engagement</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stats.interactions.engagementTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.375rem'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="likes" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Section détaillée */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Top événements */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>🏆 Top 5 Événements Populaires</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.events.topEvents.map((event, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '1.5rem',
                                            height: '1.5rem',
                                            borderRadius: '50%',
                                            backgroundColor: index < 3 ? '#fbbf24' : '#6b7280',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {index + 1}
                                        </span>
                                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                                            {event.name}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {new Date(event.date).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    color: '#f59e0b',
                                    fontWeight: '600'
                                }}>
                                    <span>❤️</span>
                                    <span>{event.interested.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Répartition utilisateurs */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>👥 Répartition des Utilisateurs</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={stats.users.roleDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        dataKey="count"
                                    >
                                        {stats.users.roleDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            {stats.users.roleDistribution.map((role, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem 0'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '2px',
                                            backgroundColor: role.color
                                        }} />
                                        <span style={{ color: '#4b5563' }}>{role.role}</span>
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                        {role.count.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: '#f0f9ff',
                                borderRadius: '0.5rem',
                                border: '1px solid #bae6fd'
                            }}>
                                <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>
                                    Nouveaux utilisateurs
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '0.25rem' }}>
                                    Cette semaine: +{stats.users.newThisWeek}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                                    Ce mois: +{stats.users.newThisMonth}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statut des événements */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1f2937' }}>📊 Statut des Événements</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            backgroundColor: '#ecfdf5',
                            borderRadius: '0.5rem',
                            border: '1px solid #a7f3d0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>🟢</span>
                                <span style={{ fontWeight: '500', color: '#065f46' }}>Actifs</span>
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#065f46' }}>
                                {stats.events.active}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '0.5rem',
                            border: '1px solid #d1d5db'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>⚪</span>
                                <span style={{ fontWeight: '500', color: '#374151' }}>Terminés</span>
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#374151' }}>
                                {stats.events.past}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            backgroundColor: '#fef2f2',
                            borderRadius: '0.5rem',
                            border: '1px solid #fecaca'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>🔴</span>
                                <span style={{ fontWeight: '500', color: '#991b1b' }}>Annulés</span>
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#991b1b' }}>
                                {stats.events.cancelled}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
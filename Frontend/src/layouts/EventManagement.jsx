import React, { useState, useEffect } from 'react';
import { recupEvents, deleteEvent, updateEvent, createEvent } from '../services/functions';
import RegisterEvent from './RegisterEvent';
import { Link } from 'react-router-dom';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_at:'',
        end_at:'',
        location: '',
    });

    // Charger tous les événements
    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const eventsData = await recupEvents();
            setEvents(eventsData);
        } catch (error) {
            console.error('Erreur lors du chargement des événements:', error);
            alert('Erreur lors du chargement des événements');
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un événement
    const handleDelete = async (eventId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            try {
                await deleteEvent(eventId);
                alert('Événement supprimé avec succès !');
                loadEvents(); // Recharger la liste
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression de l\'événement');
            }
        }
    };

    // Modifier un événement
    const handleEdit = (event) => {
        setEditingEvent(event.id);
        setFormData({
            title: event.title,
            description: event.description,
            start_at: event.start_at,
            end_at: event.end_at,
            location: event.location,
        });
        setShowCreateForm(true);
    };

    // Créer un nouvel événement
    const handleCreate = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            start_at:'',
            end_at: '',
            location: '',
        });
        setShowCreateForm(true);
    };

    // Sauvegarder (créer ou modifier)
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await updateEvent(editingEvent, formData);
                alert('Événement modifié avec succès !');
            } else {
                await createEvent(formData);
                alert('Événement créé avec succès !');
            }
            setShowCreateForm(false);
            setEditingEvent(null);
            loadEvents(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde de l\'événement');
        }
    };

    // Annuler l'édition
    const handleCancel = () => {
        setShowCreateForm(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            start_at:'',
            end_at:'',
            location: '',
        });
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh' 
            }}>
                <div>⏳ Chargement des événements...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h2>📅 Gestion des Événements</h2>
                <button 
                    onClick={handleCreate}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ➕ Créer un événement
                </button>
            </div>

            {/* Formulaire de création/modification */}
            {showCreateForm && (
                <RegisterEvent/>
            )}

            {/* Liste des événements */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {events.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                        <h3>Aucun événement trouvé</h3>
                        <p>Créez votre premier événement en cliquant sur le bouton ci-dessus.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                                        {event.title}
                                    </h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', margin: '1rem 0' }}>
                                        {event.date && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>📅</span>
                                                <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        )}
                                        
                                        {event.location && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>📍</span>
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                        
                                        {event.price !== undefined && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>💰</span>
                                                <span>{event.price === 0 ? 'Gratuit' : `${event.price}€`}</span>
                                            </div>
                                        )}
                                        
                                        {event.capacity && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>👥</span>
                                                <span>{event.capacity} places</span>
                                            </div>
                                        )}
                                    </div>

                                    {event.description && (
                                        <p style={{ 
                                            margin: '0.5rem 0 0 0', 
                                            color: '#6b7280',
                                            lineHeight: '1.5'
                                        }}>
                                            {event.description}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>


                                    <button
                                        onClick={() => handleEdit(event)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                        title="Modifier"
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <Link className='btn' to={`/events/${event.id}/hourly`}>Crée un Planning</Link>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                        title="Supprimer"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventManagement;
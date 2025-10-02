import React, { useState, useEffect } from 'react';
import { recupEvents, deleteEvent, getHourlyByEvent, updateEvent } from '../services/functions';
import RegisterEvent from './RegisterEvent';
import { Link } from 'react-router-dom';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [eventPlannings, setEventPlannings] = useState({});
  const [loadingPlannings, setLoadingPlannings] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await recupEvents();
      setEvents(eventsData);
      
      // Charger les plannings après l'affichage des événements
      setLoading(false);
      loadPlanningsCount(eventsData);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setLoading(false);
    }
  };

  // 📊 Charger le nombre de plannings pour chaque événement de manière asynchrone
  const loadPlanningsCount = async (eventsData) => {
    setLoadingPlannings(true);
    const planningsCount = {};
    
    // Charger les plannings un par un pour ne pas bloquer l'interface
    for (const event of eventsData) {
      try {
        const res = await getHourlyByEvent(event.id);
        const data = res?.data ?? res;
        const hourliesData = Array.isArray(data) ? data : (data ? [data] : []);
        const validPlannings = hourliesData.filter(h => h && h.id);
        planningsCount[event.id] = validPlannings.length;
        
        // Mettre à jour progressivement
        setEventPlannings(prev => ({ ...prev, [event.id]: validPlannings.length }));
      } catch (error) {
        console.error(`Erreur plannings événement ${event.id}:`, error);
        planningsCount[event.id] = 0;
        setEventPlannings(prev => ({ ...prev, [event.id]: 0 }));
      }
    }
    
    setLoadingPlannings(false);
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setDeleteConfirm(null);
      loadEvents();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // ✏️ Ouvrir le formulaire d'édition
  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  // ✅ Fermer les formulaires
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  // ✅ Callback après succès de création/modification
  const handleFormSuccess = () => {
    handleCloseForm();
    loadEvents();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-base-200 gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/70">Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Gestion des Événements
            <span className="badge badge-primary badge-lg">{events.length}</span>
          </h2>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowEditForm(false);
              setSelectedEvent(null);
            }}
            className="btn btn-primary gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer un événement
          </button>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Nouvel événement
                  </h3>
                  <button
                    onClick={handleCloseForm}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    ✕
                  </button>
                </div>
                <RegisterEvent onSuccess={handleFormSuccess} />
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'édition */}
        {showEditForm && selectedEvent && (
          <div className="mb-8">
            <div className="card bg-base-100 shadow-xl border-2 border-warning">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-warning"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Modifier : {selectedEvent.title}
                  </h3>
                  <button
                    onClick={handleCloseForm}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    ✕
                  </button>
                </div>
                <RegisterEvent 
                  eventToEdit={selectedEvent}
                  onSuccess={handleFormSuccess}
                />
              </div>
            </div>
          </div>
        )}

        {/* Liste des événements */}
        {events.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-base-content/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">Aucun événement trouvé</h3>
              <p className="text-base-content/70 mb-4">
                Créez votre premier événement en cliquant sur le bouton ci-dessus.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="card-title text-xl">{event.title}</h3>
                        
                        {/* Badge nombre de plannings */}
                        <div className="flex items-center gap-2">
                          {loadingPlannings && eventPlannings[event.id] === undefined ? (
                            <div className="badge badge-ghost gap-2">
                              <span className="loading loading-spinner loading-xs"></span>
                              Chargement...
                            </div>
                          ) : (
                            <div 
                              className="tooltip" 
                              data-tip={`${eventPlannings[event.id] || 0} planning(s) créé(s)`}
                            >
                              <div className={`badge gap-2 ${
                                (eventPlannings[event.id] || 0) === 0 
                                  ? 'badge-ghost' 
                                  : 'badge-success'
                              }`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {eventPlannings[event.id] || 0} planning{(eventPlannings[event.id] || 0) > 1 ? 's' : ''}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4">
                        {event.start_at && (
                          <div className="badge badge-primary badge-lg gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(event.start_at).toLocaleDateString('fr-FR')}
                          </div>
                        )}

                        {event.end_at && (
                          <div className="badge badge-secondary badge-lg gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Fin: {new Date(event.end_at).toLocaleDateString('fr-FR')}
                          </div>
                        )}

                        {event.location && (
                          <div className="badge badge-info badge-lg gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-base-content/70 line-clamp-2">{event.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 justify-end">
                      <Link
                        to={`/events/${event.id}/hourly`}
                        className="btn btn-accent btn-sm gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Planning
                      </Link>

                      <button
                        onClick={() => handleEdit(event)}
                        className="btn btn-warning btn-sm gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Modifier
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(event)}
                        className="btn btn-error btn-sm gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteConfirm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Confirmer la suppression
              </h3>
              
              <div className="alert alert-warning mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Cette action est irréversible !</span>
              </div>

              <p className="text-base-content/70 mb-2">
                Êtes-vous sûr de vouloir supprimer l'événement :
              </p>
              <p className="font-bold text-lg mb-4 text-error">"{deleteConfirm.title}"</p>
              
              {eventPlannings[deleteConfirm.id] > 0 && (
                <div className="alert alert-info mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{eventPlannings[deleteConfirm.id]} planning(s) seront également supprimés</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="btn btn-error"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={() => setDeleteConfirm(null)}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
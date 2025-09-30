import React, { useState } from 'react';
import LoadEvents from "../layouts/LoadEvents";
import AvatarMenu from "../components/miniComponents/AvatarMenu";
import DeconnexionBTN from "../components/miniComponents/DeconnexionBTN";
import Calendars from "../layouts/Calendars"

export default function Events() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                
                {/* Header */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                                    <span className="text-primary text-4xl">@</span>
                                    Événements
                                </h1>
                                <p className="text-base-content/60 mt-2">
                                    Découvrez tous les événements disponibles
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <AvatarMenu />
                                <DeconnexionBTN />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="card bg-base-100 shadow-lg mb-6">
                   {/* <div className="card-body p-4">
                         <div className="flex flex-col lg:flex-row gap-4 items-center">
                            
                            {/* Search Input */}
                            {/* <div className="flex-1 w-full">
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                                    </svg>
                                    <input 
                                        type="text" 
                                        className="grow" 
                                        placeholder="Rechercher un événement..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                            </div> */}

                            {/* Filter Buttons */}
                            {/* <div className="flex gap-2 flex-wrap">
                                <div className="join">
                                    {['all', 'concert', 'conférence', 'festival'].map((filter) => (
                                        <button 
                                            key={filter}
                                            className={`btn btn-sm join-item ${selectedFilter === filter ? 'btn-primary' : 'btn-ghost'}`}
                                            onClick={() => setSelectedFilter(filter)}
                                        >
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div> */}

                            {/* View Toggle */}
                            {/* <div className="join">
                                <button 
                                    className={`btn btn-sm join-item ${viewMode === 'grid' ? 'btn-active btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Vue grille"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button 
                                    className={`btn btn-sm join-item ${viewMode === 'list' ? 'btn-active btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setViewMode('list')}
                                    title="Vue liste"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div> 
                        </div> 
                    </div> */}
                </div>

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="stat-title">Événements actifs</div>
                        <div className="stat-value text-primary">24</div>
                        <div className="stat-desc">↗︎ 6 nouveaux cette semaine</div>
                    </div>
                    
                    <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total participants</div>
                        <div className="stat-value text-secondary">1,846</div>
                        <div className="stat-desc">↗︎ 22% ce mois</div>
                    </div>
                    
                        <div className="stat bg-base-100 shadow-lg rounded-box border border-base-300">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="stat-title">Taux de satisfaction</div>
                        <div className="stat-value text-accent">98%</div>
                        <div className="stat-desc">Basé sur 456 avis</div>
                    </div>
                </div> */}

                {/* Events List */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title text-2xl">
                                <span className="text-primary">📋</span>
                                Liste des événements
                            </h2>
                            {/* <div className="badge badge-lg badge-primary">
                                {searchTerm ? 'Résultats filtrés' : 'Tous les événements'}
                            </div> */}
                        </div>
                        <LoadEvents />
                    </div>
                    <Calendars />
                </div>

                {/* Pagination */}
                {/* <div className="flex justify-center mt-8">
                    <div className="join">
                        <button className="join-item btn btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">2</button>
                        <button className="join-item btn btn-sm">3</button>
                        <button className="join-item btn btn-sm">4</button>
                        <button className="join-item btn btn-sm btn-disabled">...</button>
                        <button className="join-item btn btn-sm">10</button>
                        <button className="join-item btn btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div> */}

                {/* Quick Actions FAB */}
                {/* <div className="fixed bottom-6 right-6 z-50">
                    <div className="dropdown dropdown-top dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-circle btn-primary btn-lg shadow-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mb-2">
                            <li className="menu-title">Actions rapides</li>
                            <li>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Créer un événement
                                </a>
                            </li>
                            <li>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filtres avancés
                                </a>
                            </li>
                            <li>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Exporter la liste
                                </a>
                            </li>
                        </ul>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
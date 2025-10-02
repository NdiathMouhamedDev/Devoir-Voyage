import { useState,useEffect } from 'react';
import LoadEvents from "../layouts/LoadEvents";
import AvatarMenu from "../components/miniComponents/AvatarMenu";
import DeconnexionBTN from "../components/miniComponents/DeconnexionBTN";
import Calendars from "../layouts/Calendars"
import MinNav from '../components/miniComponents/MinNav';

export default function Events() {
    useEffect(() => {
        document.title = "Events | Touba Events";
      }, []);

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

                {/* Events List */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title text-2xl">
                                <span className="text-primary">📋</span>
                                Liste des événements
                            </h2>
                        </div>
                        <LoadEvents />
                    </div>
                    <Calendars />
                </div>

                
            </div>
            <MinNav/>
        </div>
    );
}
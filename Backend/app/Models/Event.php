<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'location', 'start_at', 'end_at', 'user_id'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime',
    ];

    /**
     * Relation avec les utilisateurs intéressés
     */
    public function interestedUsers()
    {
        return $this->belongsToMany(User::class, 'event_users',)
                    ->withTimestamps();
    }

    /**
     * Utilisateur qui a créé l'événement on v2
     */
    // public function creator()
    // {
    //     return $this->belongsTo(User::class, 'created_by');
    // }

    /**
     * Vérifier si un utilisateur est intéressé par cet événement
     */
    public function isUserInterested($userId)
    {
        return $this->interestedUsers()->where('user_id', $userId)->exists();
    }

    public function interestedEvents()
    {
        return $this->belongsToMany(Event::class, 'event_user');
    }


    /**
     * Nombre d'utilisateurs intéressés
     */
    public function getInterestedCountAttribute()
    {
        return $this->interestedUsers()->count();
    }
}
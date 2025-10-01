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
        return $this->belongsToMany(User::class, 'interested_event_user','event_id', 'user_id')
                    ->withTimestamps();
    }


    /**
     * Vérifier si un utilisateur est intéressé par cet événement
     */
    public function isUserInterested($userId)
    {
        return $this->interestedUsers()->where('user_id', $userId)->exists();
    }



    /**
     * Nombre d'utilisateurs intéressés
     */
    public function getInterestedCountAttribute()
    {
        return $this->interestedUsers()->count();
    }

    public function hourlies()
    {
        return $this->hasMany(Hourly::class);
    }

    public function inscriptions ()
    {
        return $this->hasMany(Inscription::class);
    }



}
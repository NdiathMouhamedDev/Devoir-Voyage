<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
// use Illuminate\Contracts\Auth\MustVerifyEmail; // ❌ Supprimé temporairement

class User extends Authenticatable // ❌ Supprimé "implements MustVerifyEmail"
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at', // Ajouté pour permettre la mise à jour manuelle
        'admin_request_status',
        'admin_requested_at',
        'admin_approved_at',
        'admin_verification_token',
    ];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    protected $hidden = [
        'password',
        'remember_token',
        'admin_verification_token', // Cacher le token
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'admin_requested_at' => 'datetime',
            'admin_approved_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function interestedEvents()
    {
        return $this->belongsToMany(Event::class, 'event_users');
    }

    /**
     * Override pour forcer la mise à jour
     */
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }
}
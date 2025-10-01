<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Illuminate\Auth\Notifications\VerifyEmail;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;


class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail());
    }
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at', // Ajouté pour permettre la mise à jour manuelle
        'phone_number',
        'address',
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


    /**
     * Override pour forcer la mise à jour
     */
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    public function inscriptions() {
        return $this->hasMany(Inscription::class);
    }


    public function interestedEvents()
    {
        return $this->belongsToMany(Event::class, 'interested_event_user', 'user_id', 'event_id')
            ->withTimestamps();
    }

    public function routeNotificationForWhatsApp()
    {
        return $this->phone; // le champ "phone" doit contenir le numéro format international
    }

}
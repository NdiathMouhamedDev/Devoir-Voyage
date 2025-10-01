<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable; // 👈 important

class Inscription extends Model
{
    use HasFactory, Notifiable; // 👈 ajoute Notifiable

    protected $table = 'inscriptions';

    protected $fillable = [
        'user_id',
        'hourly_id',
        'event_id',
        'statuts',
        'payment',
        'phone_number',
        'address'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function event() {
        return $this->belongsTo(Event::class);
    }

    public function hourly() {
        return $this->belongsTo(Hourly::class);
    }

    // 👇 Permet d’indiquer à Laravel Notifications le numéro WhatsApp
    public function routeNotificationForWhatsApp()
    {
        return $this->phone_number; // ✅ Utilisation de inscriptions.phone_number
    }
}

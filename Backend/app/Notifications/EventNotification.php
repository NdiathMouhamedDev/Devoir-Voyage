<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EventNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function via($notifiable)
    {
        // ⚠️ Seulement si email est vérifié
        if ($notifiable->hasVerifiedEmail()) {
            return ['database', 'broadcast'];
        }
        return ['database']; // stocké mais pas diffusé
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => 'Un nouvel événement est disponible !'
        ]);
    }
}

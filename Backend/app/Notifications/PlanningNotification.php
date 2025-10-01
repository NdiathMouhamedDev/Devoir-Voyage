<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class PlanningNotification extends Notification
{
    use Queueable;

    protected $hourly;
    protected $type; // inscription, reminder_1d, reminder_30m

    public function __construct($hourly, $type = 'inscription')
    {
        $this->hourly = $hourly;
        $this->type   = $type;
    }

    public function via($notifiable)
    {
        return [WhatsAppChannel::class];
    }

    public function toWhatsApp($notifiable)
{
    // $notifiable est déjà l'inscription, donc l'utilisateur est accessible via $notifiable->user
    $userName = $notifiable->user->name ?? 'Utilisateur';
    
    switch ($this->type) {
        case 'inscription':
            return "✅ Bonjour {$userName}, votre inscription est confirmée !\n"
                 . "📅 Planning: {$this->hourly->title}\n"
                 . "🕒 Départ prévu: {$this->hourly->startup}\n"
                 . "📍 Lieu: {$this->hourly->place}";

        case 'reminder_1d':
            return "⏰ Rappel : demain vous avez le planning {$this->hourly->title}.\n"
                 . "🕒 Départ: {$this->hourly->startup}\n"
                 . "📍 Lieu: {$this->hourly->place}";

        case 'reminder_30m':
            return "⚡ Dernier rappel : dans 30 minutes commence {$this->hourly->title}.\n"
                 . "Soyez prêt ! 🚌";

        default:
            return null;
    }
}
}

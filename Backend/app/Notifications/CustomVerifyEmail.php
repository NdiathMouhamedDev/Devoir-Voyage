<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $verificationUrl;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Demande de rôle Administrateur')
            ->greeting('Bonjour ' . $notifiable->name . ' !')
            ->line('Vous avez demandé à devenir administrateur de notre plateforme.')
            ->line('Pour confirmer votre demande et obtenir les privilèges administrateur, cliquez sur le bouton ci-dessous :')
            ->action('Confirmer la demande Admin', $this->verificationUrl)
            ->line('⚠️ **Important** : Ce lien expire dans 24 heures.')
            ->line('Si vous n\'avez pas fait cette demande, ignorez cet email.')
            ->line('')
            ->line('**Privilèges administrateur :**')
            ->line('• Gestion complète des événements')
            ->line('• Accès au panneau d\'administration')
            ->line('• Modération des utilisateurs')
            ->line('')
            ->line('Merci d\'utiliser notre plateforme !')
            ->salutation('Cordialement, L\'équipe ' . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'message' => 'Demande de rôle administrateur',
            'url' => $this->verificationUrl,
            'user_id' => $notifiable->id
        ];
    }
}
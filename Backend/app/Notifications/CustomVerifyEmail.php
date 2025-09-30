<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmail
{
    /**
     * Canaux de notification
     */
    public function via($notifiable)
    {
        // On envoie par mail ET on enregistre en base
        return ['mail', 'database'];
    }

    /**
     * Construire l'email
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Vérifie ton adresse email')
            ->line('Clique sur le bouton ci-dessous pour vérifier ton adresse email.')
            ->action('Vérifier mon email', $verificationUrl)
            ->line('Si tu n’as pas créé de compte, ignore cet email.');
    }

    /**
     * Ce qui sera stocké en base (table notifications)
     */
    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Un email de vérification t’a été envoyé.',
            'email'   => $notifiable->email,
        ];
    }

    /**
     * Génère l’URL de vérification
     */
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify', // ta route dans api.php
            Carbon::now()->addMinutes(60),
            [
                'id'   => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}

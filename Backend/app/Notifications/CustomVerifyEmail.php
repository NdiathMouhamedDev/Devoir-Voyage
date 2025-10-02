<?php
namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmail extends VerifyEmail
{
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        // Charger ton HTML
        $html = file_get_contents(resource_path('mails/verify.html'));

        // Remplacer les variables dynamiques
        $html = str_replace('{{name}}', $notifiable->name, $html);
        $html = str_replace('{{url}}', $verificationUrl, $html);

        // Envoyer via la vue wrapper
        return (new MailMessage)
            ->subject('Vérifie ton adresse email')
            ->view('emails.raw', ['html' => $html]);
    }

}

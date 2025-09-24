<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Personnaliser l'URL de vérification d'email
        VerifyEmail::createUrlUsing(function ($notifiable) {
            return url(
                route('verification.verify', [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ], false)
            );
        });

        // Ou personnaliser complètement l'email de vérification
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
        // Découper l’URL Laravel pour récupérer id et hash
        $parsedUrl = parse_url($url);
        $path = explode('/', $parsedUrl['path']);
        $id = $path[count($path) - 2];
        $hash = $path[count($path) - 1];

        // Rediriger vers le frontend au lieu du backend
        $frontendUrl = "http://localhost:5173/verify-email?id={$id}&hash={$hash}";

        return (new MailMessage)
            ->subject('Vérifiez votre adresse email')
            ->line('Cliquez sur le bouton ci-dessous pour vérifier votre adresse email.')
            ->action('Vérifier mon email', $frontendUrl);
        });
    }
}
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $instanceId;
    protected $token;
    protected $baseUrl = 'https://api.ultramsg.com';

    public function __construct()
    {
        $this->instanceId = config('services.ultramsg.instance_id');
        $this->token = config('services.ultramsg.token');
    }

    /**
     * Envoyer un message WhatsApp
     * 
     * @param string $to Numéro au format international (ex: 221771234567)
     * @param string $message Le contenu du message
     * @return array
     */
    public function sendMessage($to, $message)
    {
        try {
            // Nettoyer le numéro (enlever espaces, tirets, +)
            $to = preg_replace('/[^0-9]/', '', $to);
            
            // Si le numéro commence par 0, remplacer par l'indicatif pays (Sénégal = 221)
            if (substr($to, 0, 1) === '0') {
                $to = '221' . substr($to, 1);
            }

            $url = "{$this->baseUrl}/{$this->instanceId}/messages/chat";

            $response = Http::asForm()->post($url, [
                'token' => $this->token,
                'to' => $to,
                'body' => $message,
                'priority' => 10,
            ]);

            Log::info('WhatsApp envoyé', [
                'to' => $to,
                'message' => $message,
                'response' => $response->json()
            ]);

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Erreur WhatsApp', [
                'error' => $e->getMessage(),
                'to' => $to
            ]);

            return [
                'sent' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
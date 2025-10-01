<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    protected static $baseUrl = "https://api.ultramsg.com/instance144681/";
    protected static $token   = "igzc0arnm49jqma8";

    public static function sendMessage($to, $message)
    {
        return Http::asForm()->post(self::$baseUrl, [
            'token'   => self::$token,
            'to'      => $to,
            'body'    => $message,
        ])->json();
    }
}

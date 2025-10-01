<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('hourly.{hourlyId}', function ($user, $hourlyId) {
    return $user->hasVerifiedEmail();
});

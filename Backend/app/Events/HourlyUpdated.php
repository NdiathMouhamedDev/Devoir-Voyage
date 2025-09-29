<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HourlyUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $hourlyId;
    public $message;

    public function __construct($hourlyId, $message)
    {
        $this->hourlyId = $hourlyId;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('hourly.' . $this->hourlyId);
    }
}

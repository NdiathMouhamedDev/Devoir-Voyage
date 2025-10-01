<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HourlyUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $hourlyId;
    public $message;
    public $data;

    public function __construct($hourlyId, $message, $data = [])
    {
        $this->hourlyId = $hourlyId;
        $this->message = $message;
        $this->data = $data;
    }

    public function broadcastOn()
    {
        // Canal privé pour un horaire spécifique
        return new Channel('hourly.' . $this->hourlyId);
    }

    public function broadcastAs()
    {
        return 'HourlyUpdated';
    }

    public function broadcastWith()
    {
        return [
            'hourly_id' => $this->hourlyId,
            'message' => $this->message,
            'data' => $this->data,
            'timestamp' => now()->toISOString(),
        ];
    }
}
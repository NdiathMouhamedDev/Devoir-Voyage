<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Inscription;
use App\Notifications\PlanningNotification;
use Carbon\Carbon;

class SendHourlyNotification extends Command
{
    /**
     * Signature = nom de la commande artisan
     */
    protected $signature = 'hourly:notify';

    /**
     * Description
     */
    protected $description = 'Envoie les notifications WhatsApp aux inscrits aux horaires';

    /**
     * Exécution de la commande
     */
    public function handle()
    {
        $now = now();

        $inscriptions = Inscription::with('hourly', 'user')->get();

        foreach ($inscriptions as $inscription) {
            $hourly = $inscription->hourly;

            if (! $hourly || ! $hourly->startup) {
                continue;
            }

            $start = Carbon::parse($hourly->startup);

            // 🔔 Notification immédiate après inscription
            if ($inscription->created_at->isSameMinute($now)) {
                $inscription->notify(new PlanningNotification($hourly, 'inscription'));
            }

            // 🔔 Rappel 1 jour avant
            if ($start->copy()->subDay()->isSameMinute($now)) {
                $inscription->notify(new PlanningNotification($hourly, 'reminder_1d'));
            }

            // 🔔 Rappel 30 minutes avant
            if ($start->copy()->subMinutes(30)->isSameMinute($now)) {
                $inscription->notify(new PlanningNotification($hourly, 'reminder_30m'));
            }
        }

        $this->info('✅ Notifications traitées à ' . $now);
    }
}

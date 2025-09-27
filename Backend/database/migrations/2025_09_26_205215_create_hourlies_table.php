<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hourlies', function (Blueprint $table) {
            $table->id();
            $table->string('titre'); // Ex: "Départ Dakar"
            $table->text('description')->nullable();
            $table->dateTime('date_heure'); // Date + heure de l’événement
            $table->string('lieu')->nullable(); // Lieu concerné
            $table->time('depart');
            $table->time('arrivee')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hourlies');
    }
};

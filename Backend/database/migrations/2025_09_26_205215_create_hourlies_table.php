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
            $table->string('title'); // Ex: "Départ Dakar"
            $table->text('description')->nullable();
            $table->dateTime('startup'); // 
            $table->dateTime('end')->nullable(); // 
            $table->string('place')->nullable(); // Lieu concerné
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

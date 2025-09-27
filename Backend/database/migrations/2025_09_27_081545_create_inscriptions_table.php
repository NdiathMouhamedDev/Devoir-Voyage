<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_inscriptions_table.php
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('event_id')->constrained()->onDelete('cascade');
        $table->foreignId('hourly_id')->nullable()->constrained()->onDelete('cascade'); 
        $table->string('phone_number')->nullable();
        $table->string('address')->nullable();
        $table->enum('payment', ['cash', 'online'])->default('cash');
        $table->enum('statuts', ['pending', 'valid', 'canceled'])->default('pending');
        $table->timestamps();
});

    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};

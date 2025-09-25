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
        Schema::table('users', function (Blueprint $table) {
            // Ajouter la colonne role si elle n'existe pas
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('email_verified_at');
            }
            
            // Ajouter les colonnes pour les demandes admin si elles n'existent pas
            if (!Schema::hasColumn('users', 'admin_request_status')) {
                $table->string('admin_request_status')->nullable()->after('role');
            }
            
            if (!Schema::hasColumn('users', 'admin_requested_at')) {
                $table->timestamp('admin_requested_at')->nullable()->after('admin_request_status');
            }
            
            if (!Schema::hasColumn('users', 'admin_approved_at')) {
                $table->timestamp('admin_approved_at')->nullable()->after('admin_requested_at');
            }
            
            if (!Schema::hasColumn('users', 'admin_verification_token')) {
                $table->string('admin_verification_token')->nullable()->after('admin_approved_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 
                'admin_request_status', 
                'admin_requested_at',
                'admin_approved_at',
                'admin_verification_token'
            ]);
        });
    }
};
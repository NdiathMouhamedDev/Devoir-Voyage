<?php
// routes/web.php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Supprimer la route de vérification d'email d'ici
// car elle est maintenant dans routes/api.php

// Si vous avez besoin d'autres routes web, ajoutez-les ici
// mais évitez les conflits avec les routes API
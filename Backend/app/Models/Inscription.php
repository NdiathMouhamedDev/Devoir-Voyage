<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = ['user_id', 'hourly_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function hourly() {
        return $this->belongsTo(Hourly::class);
    }

    public function store(Request $request, $hourlyId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Vous devez être connecté'], 401);
        }

        $hourly = Hourly::findOrFail($hourlyId);

        if (Carbon::now()->greaterThanOrEqualTo($hourly->date_heure)) {
            return response()->json(['message' => 'Impossible de s’inscrire, l’événement a déjà commencé'], 403);
        }

        $validated = $request->validate([
            'telephone' => 'nullable|string',
            'paiement' => 'required|in:cash,online',
        ]);

        // 🔹 Mise à jour des infos utilisateur
        $user->update([
            'telephone' => $validated['telephone'] ?? $user->telephone,
        ]);

        // Vérifier doublon
        $exists = Inscription::where('user_id', $user->id)
            ->where('hourly_id', $hourly->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cet horaire'], 409);
        }

        $inscription = Inscription::create([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => [
                'inscription' => $inscription,
                'user' => $user
            ]
        ], 201);
    }

}

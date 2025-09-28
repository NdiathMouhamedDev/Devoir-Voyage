<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Container\Attributes\Auth;
use Symfony\Component\HttpFoundation\Request;
use Illuminate\Support\Carbon;


class Inscription extends Model
{

    use HasFactory;
    protected $table = 'inscriptions';

    protected $fillable = ['user_id', 'hourly_id', 'event_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function event() {
        return $this->belongsTo(Event::class);
    }
    public function hourly() {
        return $this->belongsTo(Hourly::class);
    }


    public function store(Request $request, $hourlyId)
    {
          dd($hourlyId, $request->all());
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Vous devez être connecté'], 401);
        }

        $hourly = Hourly::findOrFail($hourlyId);
        dd($hourly);

        // Vérifier si l’événement a déjà commencé
        if (!empty($hourly->startup) && Carbon::now()->greaterThanOrEqualTo($hourly->startup)) {
            return response()->json(['message' => 'Impossible de s’inscrire, l’événement a déjà commencé'], 403);
        }


        $validated = $request->validate([
            'payment' => 'required|in:cash,online',
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

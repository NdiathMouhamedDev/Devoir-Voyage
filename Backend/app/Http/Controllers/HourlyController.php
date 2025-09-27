<?php

namespace App\Http\Controllers;

use App\Models\Hourly;
use Illuminate\Http\Request;

class HourlyController extends Controller
{
    // Liste des horaires
    public function index() {
        return Hourly::orderBy('startup', 'asc')->get();
    }


    public function show($id)
    {
        $hourly = Hourly::find($id);

        if (!$hourly) {
            return response()->json([
                "success" => false,
                "message" => "Horaire introuvable"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $hourly
        ], 200);
    }


    // Ajouter un Hourly
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string|max:255',
            'place' => 'string',
            'startup' => 'required',
            'end' => 'nullable',
        ]);

        $hourly = Hourly::create($validated);

        return response()->json($hourly, 201);
    }


    // Mettre à jour un Hourly
    public function update(Request $request, Hourly $hourly)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|date',
            'place' => 'nullable|string',
            'startup' => 'required',
            'end' => 'nullable',
        ]);

        

        $hourly->update($validated);

        return response()->json($hourly, 201);

    }


    // Supprimer
    public function destroy(Hourly $hourly) {
        $hourly->delete();
        return response()->json(['message' => 'horaire supprimé']);
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HourlyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    public function rules()
    {
        return [
            'titre' => 'required|string|max:255',
            'date_heure' => 'required|date|after_or_equal:now',
            'lieu' => 'nullable|string|max:255',
            'depart' => 'required|date_format:H:i',
            'arrivee' => 'nullable|date_format:H:i|after_or_equal:depart',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $date = $this->input('date_heure');
            $depart = $this->input('depart');
            $arrivee = $this->input('arrivee');

            if ($date && $depart) {
                $eventDate = new \DateTime($date);
                $departTime = new \DateTime($eventDate->format('Y-m-d') . ' ' . $depart);

                if ($departTime < $eventDate) {
                    $validator->errors()->add('depart', "⚠️ L'heure de départ doit être après la date/heure de l’événement.");
                }

                if ($arrivee) {
                    $arriveeTime = new \DateTime($eventDate->format('Y-m-d') . ' ' . $arrivee);
                    if ($arriveeTime < $departTime) {
                        $validator->errors()->add('arrivee', "⚠️ L'heure d'arrivée doit être après l'heure de départ.");
                    }
                }
            }
        });
    }

}

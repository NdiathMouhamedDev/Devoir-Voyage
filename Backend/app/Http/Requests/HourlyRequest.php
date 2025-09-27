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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'startup' => 'required|date|after_or_equal:now',
            'end' => 'nullable|date_format:H:i|after_or_equal:startup',
            'place' => 'required|strint|max:255',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $startup = $this->input('end');
            $end = $this->input('end');

            if ($end && $startup) {
                $Date = new \DateTime();
                $startupTime = new \DateTime($Date->format('Y-m-d') . ' ' . $startup);

                if ($startupTime < $Date) {
                    $validator->errors()->add('depart', "⚠️ L'heure de départ doit être après la date/heure de l’événement.");
                }

                if ($end) {
                    $endTime = new \DateTime($Date->format('Y-m-d') . ' ' . $end);
                    if ($endTime < $startupTime) {
                        $validator->errors()->add('end', "⚠️ L'heure d'arrivée doit être après l'heure de départ.");
                    }
                }
            }
        });
    }

}

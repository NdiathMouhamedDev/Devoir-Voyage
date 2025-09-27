<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hourly extends Model
{
    protected $table = 'hourlies'; // ⚡️ adapte si ta table a un nom différent
    protected $fillable = [
        'title',
        'description',
        'startup',
        'end',
        'place',
    ];

    public function inscriptions() {
        return $this->hasMany(Inscription::class);
    }

}

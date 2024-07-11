<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $table = 'TCurrency';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Currency','UserID','CurrencySymbol'
    ];

    protected $primaryKey = 'CurrencyID';

    public $timestamps = false;

}

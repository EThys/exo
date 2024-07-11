<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SMS extends Model
{
    protected $table = 'TSMS';

    protected $fillable = [
        'Number', 'Text', 'Time',
    ];

    protected $primaryKey = 'SMSID';

    public $timestamps = false;
}

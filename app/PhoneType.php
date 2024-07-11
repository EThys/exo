<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneType extends Model
{
    use HasFactory;

    protected $table = 'TPhoneTypes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'PhoneNumber',
        'Type',
        'Note'
    ];

    protected $primaryKey = 'PhoneTypeID';

    public $timestamps = false;
}

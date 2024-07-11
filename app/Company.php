<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'TCompany';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'CompanyName','CompanyCode','EmailCompany'
    ];

    protected $primaryKey = 'CompanyID';

    public $timestamps = false;

    public function users()
    {
        return $this->hasMany(User::class, 'CompanyFID', 'CompanyID');
    }
}

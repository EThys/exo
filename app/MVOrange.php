<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MVOrange extends Model
{
    protected $table = 'TMVOrange';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FromBranchFID',
        'MVNumber',
        'MVAmount',
        'MVCurrencyFID',
        'MVNotes',
        'MVUserFID',
        'MVDate',
        'CreatedDate',
        'USSDResponse',
        'UpdatedAt',
        'Sent',
        'FakeID'
    ];

    protected $casts = [
        'MVAmount' => 'float',
   ];

    protected $primaryKey = 'MVOrangeID';

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'MVUserFID', 'UserID');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'MVCurrencyFID', 'CurrencyID');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'FromBranchFID', 'CompanyID');
    }
}

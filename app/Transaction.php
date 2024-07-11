<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
class Transaction extends Model
{

    use HasFactory;
    protected $table = 'TTransaction';

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

    protected $primaryKey = 'TransactionID';

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

    public function type()
    {
        return $this->belongsTo(PhoneType::class, 'MVNumber', 'PhoneNumber');
    }

    public function getMVDateAttribute()
    {
        $dateTime = Carbon::parse($this->attributes['MVDate']);
        $formattedDateTime = $dateTime->format('Y-m-d H:i');
        return $formattedDateTime;
    }
}

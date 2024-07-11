<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    protected $table = 'TToken';

    protected $fillable = [
        'UserFID',
        'AccessToken',
        'RefreshToken',
        'ExpiresIn',
    ];

    protected $primaryKey = 'TokenID';

    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    public function user()
    {
        return $this->belongsTo('App\User', 'UserFID', 'UserID');
    }
}

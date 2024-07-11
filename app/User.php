<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'TUser';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'CompanyFID',
        'UserName',
        'Password',
        'Admin',
        'TwoFactorCode',
        'Phone',
        'RememberToken',
        'SSMA_TimeStamp'

    ];

    protected $primaryKey = 'UserID';

    public $timestamps = false;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'Password',
        'RememberToken',
        'TwoFactorCode'
    ];

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function getRememberToken()
    {
        return $this->RememberToken;
    }

    public function setRememberToken($value)
    {
        $this->RememberToken = $value;
    }

    public function getRememberTokenName()
    {
        return 'RememberToken';
    }

    public function tokens()
    {
        return $this->hasMany(Token::class, 'UserFID', 'UserID');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'CompanyFID', 'CompanyID');
    }

    public function isAdmin()
    {
        return !!$this->Admin;
    }

    public function orangeMvs()
    {
        return $this->hasMany(MVOrange::class, 'MVUserFID', 'UserID');
    }
}

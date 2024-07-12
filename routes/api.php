<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->namespace('API')->group(function () {
Route::post('/login','AuthController@postLogin');
Route::post('/register','AuthController@Register');
Route::post('/companyCreate','CompanyController@Store');
Route::post('/currencyCreate','CurrencyController@Store');
Route::delete('/currencyDelete/{id}','CurrencyController@destroy');
Route::delete('/companyDelete/{id}','CompanyController@destroy');
Route::post('/verifyCode','AuthController@postverifyCode');

Route::group([ 'middleware' => ['auth:token', 'throttle:500,1'] ], function () {
Route::get('/logout','AuthController@postLogout');
Route::get('/transactionDelete/{id}','MVOrangeController@destroy');
Route::get('/transactionUpdate/{id}','MVOrangeController@update');
Route::resource('transactions', 'MVOrangeController')->only([
            'index',
            'store',
]);
Route::resource('phone_types', 'PhoneTypeController')->only([
            'index',
            'store',
            'update',
            'destroy'
]);
Route::resource('currency', 'CurrencyController')->only([
    'index'
]);
Route::resource('company', 'CompanyController')->only([
    'index'
]);
Route::resource('user', 'UserController')->only([
    'index',
    'store',
    'update',
    'destroy'
]);
Route::get('phone_types/{number}', 'PhoneTypeController@getTypeByNumber');
Route::get('transactions/check/{id}', 'MVOrangeController@checkTransaction');

Route::post('sms', 'SMSController@post');
    });
});


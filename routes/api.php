<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->namespace('API')->group(function () {
Route::post('/login','AuthController@postLogin');
Route::post('/register','AuthController@Register');
Route::post('/companyCreate','CompanyController@Store');
Route::post('/currencyCreate','CurrencyController@Store');
Route::get('/currencyDelete/{id}','CurrencyController@destroy');
Route::get('/companyDelete/{id}','CompanyController@destroy');
Route::post('/verifyCode','AuthController@postverifyCode');

Route::group([ 'middleware' => ['auth:token', 'throttle:500,1'] ], function () {
Route::get('/logout','AuthController@postLogout');
Route::resource('transactions', 'MVOrangeController')->only([
            'index',
            'store',
]);
Route::resource('phone_types', 'PhoneTypeController')->only([
            'index',
            'store',
]);
Route::get('/phoneTypeDelete/{id}','PhoneTypeController@destroy');
Route::post('/phoneTypeUpdate/{id}','PhoneTypeController@update');

Route::get('/transactionDelete/{id}','MVOrangeController@destroy');
Route::post('/transactionUpdate/{id}','MVOrangeController@update');
Route::resource('currency', 'CurrencyController')->only([
    'index'
]);
Route::resource('company', 'CompanyController')->only([
    'index'
]);
Route::resource('user', 'UserController')->only([
    'index',
    'store',
]);
Route::get('/userDelete/{id}','UserController@destroy');
Route::post('/userUpdate/{id}','UserController@update');

Route::get('phone_types/{number}', 'PhoneTypeController@getTypeByNumber');
Route::get('transactions/check/{id}', 'MVOrangeController@checkTransaction');

Route::post('sms', 'SMSController@post');
    });
});


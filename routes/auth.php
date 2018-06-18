<?php
/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('auth/login', [
    'as' => 'auth.email', 'uses' => 'AuthController@emailLogin'
]);

Route::post('auth/{provider}', [
    'as' => 'auth.social', 'uses' => 'AuthController@handleProviderCallback'
]);

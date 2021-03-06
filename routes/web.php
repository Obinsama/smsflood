<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/

Route::get('/test', 'ChatController@index');
Route::post('messages', 'ChatController@sendMessage');
Route::post('messages/status', 'ChatController@update');
Route::post('messages/count', 'ChatController@count');

Auth::routes();

Route::get('/', 'HomeController@index')->name('home');

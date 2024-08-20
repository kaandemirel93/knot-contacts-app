<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'create']);
Route::get('/contacts/{id}', [ContactController::class, 'find']);
Route::put('/contacts/{id}', [ContactController::class, 'update']);
Route::delete('/contacts/{id}', [ContactController::class, 'delete']);
Route::get('/contacts/{id}/history', [ContactController::class, 'history']);

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authenticationController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\ShareNotesController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['prefix' => '/auth','as' => 'auth.'], function () {
    Route::post("/signup", [authenticationController::class,"index"]);
    Route::post("/login", [authenticationController::class,"login"]);
});


Route::post("/createnote",  [NotesController::class,"create"]);
Route::get("/getallnotes",  [NotesController::class,"index"]);
Route::get("/editnote/{id}",  [NotesController::class,"edit"]);
Route::put("/updatenote/{id}", [NotesController::class,"update"]);
Route::get("/deletenote/{id}", [NotesController::class,"destroy"]);
Route::delete("/logout", [authenticationController::class,"logout"])->middleware("auth:sanctum");
Route::get("/getusers",[authenticationController::class,"getUsers"])->middleware("auth:sanctum");
Route::get("/getcategories", [NotesController::class,"getCategories"]);


Route::post("/sharenotes", [ShareNotesController::class,"shareNotes"]);
Route::get("/getsharenotes", [ShareNotesController::class,"getShareNotesById"]);

Route::post("/searchnotes",[NotesController::class,"searchNotes"]);





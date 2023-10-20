<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShareNotes extends Model
{
    use HasFactory;

    protected $fillable = [
        "note_id",	"share_to",	"share_by"
    ];
}

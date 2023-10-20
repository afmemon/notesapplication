<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('share_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('note_id'); 
            $table->foreign('note_id')->references('id')->on('notes')->onDelete('cascade')->onUpdate("cascade");
            $table->unsignedBigInteger('share_to'); 
            $table->foreign('share_to')->references('id')->on('users')->onDelete('cascade')->onUpdate("cascade");;
            $table->unsignedBigInteger('share_by'); 
            $table->foreign('share_by')->references('id')->on('users')->onDelete('cascade')->onUpdate("cascade");;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('share_notes');
    }
};

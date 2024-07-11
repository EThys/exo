<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('TToken', function (Blueprint $table) {
            $table->bigIncrements('TokenID');
            $table->unsignedBigInteger('UserFID');
            $table->string('AccessToken');
            $table->string('RefreshToken')->nullable();
            $table->dateTime('ExpiresIn')->nullable();
            $table->dateTime('CreatedAt');  
            $table->dateTime('UpdatedAt');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TToken');
    }
};

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
        Schema::create('TUser', function (Blueprint $table) {
            $table->bigIncrements('UserID');
            $table->unsignedBigInteger('CompanyFID');
            $table->string('UserName');
            $table->string('Password');
            $table->tinyInteger('Admin');  
            $table->integer('TwoFactorCode')->nullable();
            $table->string('Phone')->nullable();
            $table->string('RememberToken')->nullable();
            $table->timestamp('SSMA_TimeStamp')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->bigIncrements('UserID');
            $table->unsignedBigInteger('CompanyFID');
            $table->string('UserName');
            $table->string('Password');
            $table->tinyInteger('Admin');  
            $table->integer('TwoFactorCode'); 
            $table->string('Phone'); 
            $table->string('RememberToken');
            $table->timestamp('SSMA_TimeStamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TUser');
    }
};

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
        Schema::create('TCompany', function (Blueprint $table) {
            $table->bigIncrements('CompanyID');
            $table->string('CompanyCode');
            $table->string('CompanyName');
            $table->string('Notes')->nullable();
            $table->string('EmailCompany');
            $table->timestamp('SSMA_TimeStamp')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TCompany');
    }
};

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
        Schema::create('TCurrency', function (Blueprint $table) {
            $table->bigIncrements('CurrencyID');
            $table->unsignedBigInteger('UserID');
            $table->string('Currency');
            $table->string('CurrencySymbol');
            $table->string('Note')->nullable();
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
       Schema::dropIfExists('TCurrency');
    }
};

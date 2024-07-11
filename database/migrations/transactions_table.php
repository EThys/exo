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
        Schema::create('TTransaction', function (Blueprint $table) {
            $table->bigIncrements('TransactionID');
            $table->unsignedBigInteger('FromBranchFID');
            $table->unsignedBigInteger('MVCurrencyFID');
            $table->unsignedBigInteger('MVUserFID');
            $table->string('MVNotes')->nullable();
            $table->string('MVNumber');
            $table->float('MVAmount');
            $table->text('USSDResponse')->nullable();
            $table->tinyInteger('Sent')->nullable();
            $table->dateTime('MVDate');
            $table->date('CreatedDate');
            $table->date('UpdatedAt')->nullable();;
            $table->string('FakeID');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TTransaction');
    }
};

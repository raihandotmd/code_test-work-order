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
        Schema::create('work_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('work_order_id');
            $table->string('product_name');
            $table->integer('quantity');
            $table->dateTime('deadline');
            $table->enum('status', ["Pending", "In Progress", "Completed", "Canceled"]);
            $table->uuid('operator_id');
            $table->uuid('created_by');
            $table->timestamps();


            $table->foreign('operator_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });

        Schema::create('work_orders_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('work_orders_id');
            $table->string('new_status');
            $table->string('previous_status');
            $table->uuid('changed_by');
            $table->string('notes');
            $table->dateTime('created_at');

            $table->foreign('work_orders_id')
                ->references('id')
                ->on('work_orders')
                ->noActionOnDelete();

            $table->foreign('changed_by')
                ->references('id')
                ->on('users')
                ->noActionOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};


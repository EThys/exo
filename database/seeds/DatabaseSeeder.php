<?php

use Illuminate\Database\Seeder;
use App\Week;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        
        // foreach ($weeks as $key => $week) {
        //     error_log($week->WeekName);
        // }

        for ($i=9999; $i > 0; $i--) { 
            error_log($i);
            if(password_verify($i, '$2y$10$fNmrLSuy.OgLAvGyktz2M.T4wW9M4rWHOuXz.H2YGOkBMqSwuXXwu')) {
                error_log('Found: ' . $i);
                break;
                $i = 1;
            }
        }
    }
}

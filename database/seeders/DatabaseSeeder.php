<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Contact::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'Tester',
            'email' => 'test@test.com',
            'phone_number' => '1111111111'
        ]);
    }
}

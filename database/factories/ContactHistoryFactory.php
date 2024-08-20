<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\ContactHistory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ContactHistoryFactory extends Factory
{
    protected $model = ContactHistory::class;

    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone_number' => $this->faker->phoneNumber(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'contact_id' => Contact::factory(),
        ];
    }
}

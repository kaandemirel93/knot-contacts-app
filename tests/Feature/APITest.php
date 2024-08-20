<?php

namespace Tests\Feature;

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class APITest extends TestCase
{
    use RefreshDatabase;

    public function test_get_all_contacts()
    {
        Contact::factory()->count(2)->create();
        $response = $this->getJson('/api/contacts');
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => ['id', 'first_name', 'last_name', 'email', 'phone_number'],
            ]);
    }

    public function test_update_contact()
    {
        $contact = Contact::factory()->create();
        $payload = [
            'first_name' => 'First_new',
            'last_name' => 'Last_new',
            'email' => 'email_new@test.com',
            'phone_number' => '123123123123'
        ];

        $response = $this->putJson("/api/contacts/{$contact->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('contacts', $payload);
        $this->assertDatabaseHas('contact_histories', [
            'contact_id' => $contact->id,
            'first_name' => $contact->first_name,
            'last_name' => $contact->last_name,
            'email' => $contact->email,
            'phone_number' => $contact->phone_number,
        ]);
    }

    public function test_delete_contacts()
    {
        $contact = Contact::factory()->create();

        $response = $this->deleteJson("/api/contacts/{$contact->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
    }
}

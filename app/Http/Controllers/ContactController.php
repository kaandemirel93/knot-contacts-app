<?php

namespace App\Http\Controllers;

use App\Events\ContactDeleted;
use App\Events\ContactUpdated;
use App\Jobs\DeleteContactJob;
use App\Jobs\UpdateContactJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\ContactHistory;

class ContactController
{
    /**
     * Return all contacts
     *
     * @return JsonResponse
     *
     */
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }

    /**
     * Create a new contact
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request)
    {
        // To simulate slow response
        sleep(20);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'phone_number' => 'required|string|max:20',
        ]);

        $contact = Contact::create($validated);
        broadcast(new ContactUpdated($contact))->toOthers();

        return response()->json($contact, 201);
    }

    /**
     * Find a contact
     *
     * @param int $id
     * @return JsonResponse
     */
    public function find(int $id)
    {
        $contact = Contact::findOrFail($id);
        return response()->json($contact);
    }

    /**
     * Update a contact
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'first_name' => 'string|max:255|nullable',
            'last_name' => 'string|max:255|nullable',
            'email' => 'email|nullable|unique:contacts,email,'.$id,
            'phone_number' => 'string|max:20|nullable',
        ]);

        UpdateContactJob::dispatch($id, $validated);
        return response()->json(['message' => 'Contact update is in progress.']);

    }

    /**
     * Delete a contact
     *
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id)
    {
        DeleteContactJob::dispatch($id);
        return response()->json(['message' => 'Contact deletion is in progress.']);
    }

    /**
     * Returns the history of a specific contact.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function history(int $id)
    {
        $contact = Contact::findOrFail($id);

        $history = ContactHistory::where('contact_id', $contact->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'contact' => $contact,
            'history' => $history,
        ]);
    }
}

<?php
namespace App\Jobs;

use App\Events\ContactUpdated;
use App\Models\Contact;
use App\Models\ContactHistory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $contactId;
    protected $updateData;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(int $contactId, $updateData)
    {
        $this->contactId = $contactId;
        $this->updateData = $updateData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $contact = Contact::find($this->contactId);
        ContactHistory::create([
            'contact_id' => $contact->id,
            'first_name' => $contact->first_name,
            'last_name' => $contact->last_name,
            'email' => $contact->email,
            'phone_number' => $contact->phone_number,
        ]);

        $contact->update($this->updateData);
        broadcast(new ContactUpdated($contact))->toOthers();
    }
}

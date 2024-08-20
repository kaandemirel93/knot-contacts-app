<?php

namespace App\Jobs;

use App\Events\ContactDeleted;
use App\Models\Contact;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteContactJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $contactId;

    /**
     * Create a new job instance.
     */
    public function __construct($id)
    {
        $this->contactId = $id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $contact = Contact::findOrFail($this->contactId);
        $contact->delete();
        broadcast(new ContactDeleted($this->contactId))->toOthers();
    }
}

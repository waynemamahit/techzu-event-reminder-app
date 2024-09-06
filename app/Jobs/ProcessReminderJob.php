<?php

namespace App\Jobs;

use App\Enums\EventStatusEnum;
use App\Models\EventReminder;
use App\Notifications\EventReminderNotif;
use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

// use Illuminate\Queue\InteractsWithQueue;
// use Illuminate\Queue\SerializesModels;

class ProcessReminderJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $events = EventReminder::where('status', EventStatusEnum::UPCOMING)
            ->whereBetween('event_date', [now(), now()->addDay()])
            ->get();

        foreach ($events as $event) {
            try {
                $event->user;
                Notification::route('mail', $event->user->email)
                    ->notify(new EventReminderNotif($event));
                Log::info('Mail has been sent to ' . $event->user->email);
            } catch (\Exception $ex) {
                Log::error("Could not send mail notification.", [$ex->getMessage()]);
            }
        }
    }
}

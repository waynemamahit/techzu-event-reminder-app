<?php

namespace App\Console\Commands;

use App\Enums\EventStatusEnum;
use App\Events\EventReminderUpdated;
use App\Models\EventReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EventCompletedCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'event-completed:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cron for update event status completed by event date.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $events = EventReminder::where('status', EventStatusEnum::UPCOMING)
            ->where('event_date', '<=', now())
            ->get();

        foreach ($events as $event) {
            $event->status = EventStatusEnum::COMPLETED;
            $event->save();
            Log::info("Event with title {$event->title} has been updated to complete!");
            EventReminderUpdated::dispatch($event->user);
        }
    }
}

<?php

use App\Models\EventReminder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $upcomingEvents = EventReminder::where('event_date', now()->addDay())->get();
    foreach ($upcomingEvents as $event) {
        Log::info('Sending email', $event);
        // Mail::to($event->email)->send(new EventReminderMail($event));
    }
})->everySecond();

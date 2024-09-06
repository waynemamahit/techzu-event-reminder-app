<?php

use App\Jobs\ProcessReminderJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new ProcessReminderJob())->everyFiveMinutes();
Schedule::command('event-completed:cron')->everyTwoSeconds();


<?php

use App\Jobs\ProcessReminderJob;
use Illuminate\Support\Facades\Schedule;

Schedule::command('event-completed:cron')->everySecond();
Schedule::job(new ProcessReminderJob())->everyThirtyMinutes();

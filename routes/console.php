<?php

use App\Jobs\ProcessReminderJob;
use Illuminate\Support\Facades\Schedule;

Schedule::command('event-completed:cron')->everyTwoSeconds();
Schedule::job(new ProcessReminderJob())->everyThirtyMinutes();

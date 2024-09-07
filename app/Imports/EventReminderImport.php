<?php

namespace App\Imports;

use App\Enums\EventStatusEnum;
use App\Models\EventReminder;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class EventReminderImport implements ToCollection
{
    private int $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function collection(Collection $rows)
    {
        $formatDate = 'Y-m-d h:i:s';

        foreach ($rows as $row) {
            $event = new EventReminder();
            $event->event_date = date(
                $formatDate,
                strtotime(
                    $row[0] ?? date($formatDate, time() + 60 * 24)
                )
            );
            $event->title = $row[1] ?? '';
            $event->description = $row[2] ?? '';
            $event->status = strtotime($row[0]) <= time() ?
                EventStatusEnum::COMPLETED : EventStatusEnum::UPCOMING;
            $event->user_id = $this->userId;
            $event->save();
        }
    }
}

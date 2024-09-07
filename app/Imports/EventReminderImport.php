<?php

namespace App\Imports;

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
        foreach ($rows as $row) {
            (new EventReminder())->saveData(
                $row[1],
                $row[2],
                $row[0],
                $this->userId
            );
        }
    }
}

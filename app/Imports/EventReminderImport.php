<?php

namespace App\Imports;

use App\Models\EventReminder;
use Maatwebsite\Excel\Concerns\ToModel;

class EventReminderImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return count($row) === 3 ? new EventReminder([
            'title' => $row[0],
            'description' => $row[1],
            'event_date' => $row[2]
        ]) : null;
    }
}

<?php

namespace App\Models;

use App\Enums\EventStatusEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventReminder extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function saveData(
        string $title,
        string $description,
        string $event_date,
        int $userId,
    ) {
        $event_timestamp = Carbon::parse(
            $event_date ?? now()->addDay()
        );

        $this->event_date = $event_timestamp;
        $this->title = $title ?? '';
        $this->description = $description ?? '';
        $this->status = $event_timestamp <= now() ?
            EventStatusEnum::COMPLETED : EventStatusEnum::UPCOMING;
        $this->user_id = $userId;

        $this->save();

        return $this;
    }
}

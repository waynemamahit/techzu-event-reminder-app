<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('event.user.{userId}', function (User $user, int $userId) {
    return $user->id === $userId;
});

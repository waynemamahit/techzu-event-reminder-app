<?php

namespace App\Http\Middleware;

use App\Models\EventReminder;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

use function PHPUnit\Framework\isNull;

class AuthUserId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $pathPrefixs = explode('/', $request->path());
        $event = EventReminder::find(intval($pathPrefixs[count($pathPrefixs) - 1]));

        if (!isset($event)) {
            return response()->json([
                'message' => 'Not found!'
            ], 404);
        }

        if ($event->user->id !== Auth::user()->id) {
            return response()->json([
                'message' => 'User Forbidden'
            ], 403);
        }

        return $next($request);
    }
}

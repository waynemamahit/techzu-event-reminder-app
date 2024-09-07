<?php

namespace App\Http\Controllers;

use App\Enums\EventStatusEnum;
use App\Http\Requests\EventReminderFormRequest;
use App\Http\Requests\EventReminderImportFormRequest;
use App\Models\EventReminder;
use App\Imports\EventReminderImport;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class EventReminderController extends Controller
{
    private function saveData(EventReminder $event, EventReminderFormRequest $request)
    {
        $event->title = $request->title;
        $event->description = $request->description;
        $event->event_date = $request->event_date;
        $event->status = EventStatusEnum::UPCOMING;
        $event->user_id = Auth::user()->id;
        $event->save();

        return $event;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            EventReminder::where('user_id', Auth::user()->id)->get(),
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventReminderFormRequest $request)
    {
        return response()->json($this->saveData(new EventReminder(), $request), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EventReminder $event)
    {
        return response()->json($event->toArray());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventReminderFormRequest $request, EventReminder $event)
    {
        return response()->json($this->saveData($event, $request)->toArray(), 201);
    }

    /**
     * Import CSV data to resource in storage.
     */
    public function import(EventReminderImportFormRequest $request)
    {
        return response()->json(
            Excel::import(new EventReminderImport(Auth::user()->id), $request->file('file')),
            201
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventReminder $event)
    {
        $event->delete();

        return response()->json($event);
    }
}

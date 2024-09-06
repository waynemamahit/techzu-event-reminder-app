export class EventReminderForm {
    title = '';
    description = '';
    event_date: string | Date = new Date().toJSON();
}

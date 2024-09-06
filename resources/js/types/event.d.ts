export enum EventReminderStatusEnum {
    UPCOMING = '0',
    COMPLETED = '1',
}

export type EventReminderDataType = {
    id: number;
    reminder_id: string;
    title: string;
    description: string;
    event_date: string | Date;
    status: EventReminderStatusEnum;
    created_at: string | Date;
    updated_at: string | Date;
};

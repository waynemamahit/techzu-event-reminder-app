import { EventReminderForm } from '@/models/EventReminder';
import { useEffect } from 'react';
import { SubmitHandler, useForm, UseFormSetValue } from 'react-hook-form';
import InputError from './InputError';
import InputLabel from './InputLabel';
import PrimaryButton from './PrimaryButton';

export default function AppForm({
    title = 'Add',
    loading = false,
    setFormData,
    onSubmit,
}: {
    title?: string;
    loading?: boolean;
    setFormData: (setValue: UseFormSetValue<EventReminderForm>) => void;
    onSubmit: SubmitHandler<EventReminderForm>;
}) {
    const {
        register,
        formState: { errors },
        reset,
        setValue,
        handleSubmit,
    } = useForm<EventReminderForm>({
        defaultValues: new EventReminderForm(),
    });

    useEffect(() => {
        if (title === 'Add' && !loading) {
            reset(new EventReminderForm());
        } else {
            setFormData(setValue);
        }
    }, [title, setFormData, setValue]);

    return (
        <dialog id="app_form_dialog" className="modal">
            <div className="modal-box -z-[50]">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>

                <h2 className="font-bold text-xl">{title} Form</h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="[&>label]:py-4 py-4"
                >
                    <div>
                        <InputLabel htmlFor="eventDate" value="Event Date" />

                        <input
                            {...register('event_date', {
                                required: {
                                    value: true,
                                    message: 'Event description required!',
                                },
                                min: new Date().getTime() + 1000 * 60 * 24,
                            })}
                            type="datetime-local"
                            className="input input-bordered w-full"
                        />

                        <InputError
                            message={errors.event_date?.message}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="title" value="Title" />

                        <input
                            id="title"
                            className="input input-bordered mt-1 block w-full"
                            {...register('title', {
                                required: {
                                    value: true,
                                    message: 'Event title required!',
                                },
                            })}
                        />

                        <InputError
                            message={errors.title?.message}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />

                        <textarea
                            id="description"
                            className="textarea textarea-bordered mt-1 block w-full"
                            {...register('description', {
                                required: {
                                    value: true,
                                    message: 'Event description required!',
                                },
                            })}
                        />

                        <InputError
                            message={errors.description?.message}
                            className="mt-2"
                        />
                    </div>

                    <PrimaryButton className="mt-4 w-full text-lg">
                        {loading ? (
                            <span className="loading loading-spinner loading-lg"></span>
                        ) : (
                            'Submit'
                        )}
                    </PrimaryButton>
                </form>
            </div>
        </dialog>
    );
}

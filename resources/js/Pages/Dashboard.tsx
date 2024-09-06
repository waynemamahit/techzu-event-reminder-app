import AppForm from '@/Components/AppForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EventReminderForm } from '@/models/EventReminder';
import { PageProps } from '@/types';
import { EventReminderDataType } from '@/types/event';
import { Head } from '@inertiajs/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Swal from 'sweetalert2';

const formatDate = 'DD MMMM YYYY hh:mm A';

export default function Dashboard({ auth, csrf_token }: PageProps) {
    const [title, setTitle] = useState('Add');
    const [selectedData, setSelectedData] =
        useState<EventReminderDataType | null>(null);
    const isNew = useMemo(() => title === 'Add', [title]);

    const { data, isLoading, isError, refetch } = useQuery<
        AxiosResponse<EventReminderDataType[]>
    >({
        queryKey: ['event'],
        queryFn: () => window.axios.get('/event'),
    });
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            method = 'patch',
            newEvent,
        }: {
            method?: 'post' | 'patch' | 'delete';
            newEvent?: EventReminderForm;
        }) =>
            window.axios[isNew ? 'post' : method](
                '/event' + (isNew ? '' : '/' + selectedData?.id),
                {
                    _token: csrf_token,
                    ...(method === 'delete' ? {} : newEvent),
                },
            ),
        onSuccess() {
            Swal.fire('Successfully!', 'Data has been mutate.', 'success');
            refetch();
        },
        onError(error: AxiosError) {
            Swal.fire(
                'Failed mutate data!',
                `Cannot ${isNew ? 'add new' : 'update existing'} data.`,
                'error',
            );
            if (error.status === 419) {
                window.location.reload();
            }
        },
    });

    const onSubmit = useCallback(
        (formData: EventReminderForm) => {
            if (!isPending) {
                mutateAsync({ newEvent: formData }).finally(() =>
                    window.app_form_dialog.close(),
                );
            }
        },
        [mutateAsync],
    );

    const onSelectedData = useCallback(
        (eventItem: EventReminderDataType) => {
            setSelectedData(eventItem);
            setTitle('Edit');
        },
        [setSelectedData, setTitle],
    );

    useEffect(() => {
        window.Echo.private('event.user.' + auth.user.id).listen(
            '.event.update',
            () => refetch(),
        );

        return () => {
            window.Echo.leave('event.user.' + auth.user.id);
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="card bg-white max-w-7xl mx-auto p-5 lg:p-8">
                    {isError ? (
                        <button
                            className="btn btn-error text-lg"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            <IoIosCloseCircleOutline className="text-2xl" />
                            <span>
                                Could not get data! Click here for refresh
                            </span>
                        </button>
                    ) : null}

                    {isLoading ? (
                        <progress className="progress progress-primary w-full"></progress>
                    ) : (
                        <>
                            <button
                                className="btn btn-primary text-lg my-4"
                                onClick={() => {
                                    setTitle('Add');
                                    window.app_form_dialog.showModal();
                                }}
                            >
                                <FaPlus />
                            </button>
                            <div className="overflow-x-auto">
                                <table className="table table-lg table-pin-rows">
                                    <thead>
                                        <tr className="text-lg">
                                            <th></th>
                                            <th>Status</th>
                                            <th>Event Date</th>
                                            <th>Title</th>
                                            <th>Created at</th>
                                            <th>Updated at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data.map((eventItem) => (
                                            <tr
                                                className="hover"
                                                key={eventItem.id}
                                            >
                                                <th>
                                                    <button
                                                        className="btn btn-accent btn-sm text-md block"
                                                        onClick={() => {
                                                            onSelectedData(
                                                                eventItem,
                                                            );
                                                            window.app_form_dialog.showModal();
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-sm text-md mt-1 block"
                                                        onClick={() => {
                                                            onSelectedData(
                                                                eventItem,
                                                            );
                                                            Swal.fire({
                                                                title: 'Are you sure?',
                                                                text: "You won't be able to revert this!",
                                                                icon: 'warning',
                                                                showCancelButton:
                                                                    true,
                                                                confirmButtonColor:
                                                                    '#3085d6',
                                                                cancelButtonColor:
                                                                    '#d33',
                                                                confirmButtonText:
                                                                    'Yes, delete it!',
                                                            }).then(
                                                                (result) => {
                                                                    if (
                                                                        result.isConfirmed
                                                                    ) {
                                                                        mutateAsync(
                                                                            {
                                                                                method: 'delete',
                                                                            },
                                                                        );
                                                                    }
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </th>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            eventItem.status ===
                                                            '1'
                                                                ? 'badge-success'
                                                                : 'badge-warning'
                                                        } badge-lg`}
                                                    >
                                                        {eventItem.status ===
                                                        '1'
                                                            ? 'completed'
                                                            : 'upcoming'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {moment(
                                                        eventItem.event_date,
                                                    ).format(formatDate)}
                                                </td>
                                                <td>{eventItem.title}</td>
                                                <td>
                                                    {moment(
                                                        eventItem.created_at,
                                                    ).format(formatDate)}
                                                </td>
                                                <td>
                                                    {moment(
                                                        eventItem.updated_at,
                                                    ).format(formatDate)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AppForm
                title={title}
                loading={isPending}
                onSubmit={onSubmit}
                setFormData={(setValue) => {
                    if (selectedData !== null) {
                        setValue('title', selectedData.title);
                        setValue('description', selectedData.description);
                        setValue('event_date', selectedData.event_date);
                    }
                }}
            />
        </AuthenticatedLayout>
    );
}

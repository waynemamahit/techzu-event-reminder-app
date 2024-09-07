import AppForm from '@/Components/AppForm';
import ImportForm from '@/Components/ImportForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EventReminderForm } from '@/models/EventReminder';
import { PageProps } from '@/types';
import { EventReminderDataType } from '@/types/event';
import { Head } from '@inertiajs/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Swal from 'sweetalert2';

const formatDate = 'DD MMMM YYYY hh:mm A';

export default function Dashboard({ auth, csrf_token }: PageProps) {
    const [title, setTitle] = useState('Add');
    const [selectedData, setSelectedData] =
        useState<EventReminderDataType | null>(null);
    const isNew = useMemo(() => title === 'Add', [title]);

    const {
        register,
        formState: { errors },
        reset,
        setValue,
        handleSubmit,
    } = useForm<EventReminderForm>({
        defaultValues: new EventReminderForm(),
    });
    const { data, isLoading, isFetching, isError, refetch } = useQuery<
        AxiosResponse<EventReminderDataType[]>
    >({
        queryKey: ['event'],
        queryFn: () => window.axios.get('/event'),
    });
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({
            method = 'put',
            newEvent,
        }: {
            method?: 'put' | 'patch' | 'delete';
            newEvent?: EventReminderForm;
        }) =>
            window.axios[isNew ? 'patch' : method](
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
        onError(error: AxiosError<{ message: string }>) {
            Swal.fire(
                'Failed mutate data!',
                `Cannot ${isNew ? 'add new' : 'update existing'} data. ` +
                    (error.status === 422 ? error.response?.data.message : ''),
                'error',
            );
            if (error.status === 419) {
                window.location.reload();
            }
        },
    });

    const onSubmit = (formData: EventReminderForm) => {
        if (!isPending) {
            mutateAsync({ newEvent: formData }).finally(() =>
                window.app_form_dialog.close(),
            );
        }
    };

    const onSelectedData = useCallback(
        (eventItem: EventReminderDataType) => {
            setSelectedData(eventItem);
            setTitle('Edit');
        },
        [setSelectedData, setTitle],
    );

    const onDelete = useCallback(
        (eventItem: EventReminderDataType) => {
            onSelectedData(eventItem);
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        await mutateAsync({
                            method: 'delete',
                        });
                        return true;
                    } catch (error) {
                        Swal.showValidationMessage(`
                            Request failed: Cannot delete the data.
                        `);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
        },
        [onSelectedData],
    );

    const openForm = (
        type: 'Add' | 'Edit' = 'Add',
        eventItem?: EventReminderDataType,
    ) => {
        setTitle(type);

        if (type === 'Add') {
            reset(new EventReminderForm());
        } else if (eventItem) {
            onSelectedData(eventItem);
            setValue('title', eventItem.title);
            setValue('description', eventItem.description);
            setValue('event_date', eventItem.event_date);
        }

        window.app_form_dialog.showModal();
    };

    const loadData = useCallback(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        window.Echo.private('event.user.' + auth.user.id).listen(
            '.event.updated',
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
                            className="btn btn-error text-lg my-3"
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
                        <div className="loading loading-spinner loading-lg text-primary mx-auto"></div>
                    ) : (
                        <>
                            <div className="flex flex-wrap justify-start gap-3 p-2">
                                <ImportForm
                                    csrf_token={csrf_token}
                                    loadData={loadData}
                                />
                                <button
                                    className="btn btn-primary tooltip text-lg"
                                    onClick={() => {
                                        openForm();
                                    }}
                                    data-tip="Add"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            {isFetching ? (
                                <progress className="progress progress-primary w-full"></progress>
                            ) : null}
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
                                                        className="btn btn-accent btn-sm tooltip text-md block"
                                                        data-tip="Edit"
                                                        onClick={() => {
                                                            openForm(
                                                                'Edit',
                                                                eventItem,
                                                            );
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-sm tooltip text-md mt-1 block"
                                                        data-tip="Delete"
                                                        onClick={() =>
                                                            onDelete(eventItem)
                                                        }
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
                register={register}
                errors={errors}
                onSubmit={handleSubmit(onSubmit)}
            />
        </AuthenticatedLayout>
    );
}

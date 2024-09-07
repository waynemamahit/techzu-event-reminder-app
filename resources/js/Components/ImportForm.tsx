import { EventReminderImportForm } from '@/models/EventReminder';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import InputError from './InputError';
import { AxiosError } from 'axios';

export default function ImportForm({
    csrf_token,
    loadData,
}: {
    csrf_token: string | null;
    loadData: () => void;
}) {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: new EventReminderImportForm(),
    });
    const { mutate, isPending } = useMutation({
        mutationFn: (data: EventReminderImportForm) => {
            const formData = new FormData();
            formData.append('file', data.file[0]);
            formData.append('_token', csrf_token as string | Blob);

            return window.axios.post('/event', formData);
        },
        onSuccess: () => {
            Swal.fire('Successfully!', 'Data has been imported.', 'success');
            loadData();
        },
        onError(error: AxiosError) {
            Swal.fire(
                'Failed import data!',
                `Cannot import file CSV data.`,
                'error',
            );
            if (error.status === 419) {
                window.location.reload();
            }
        },
    });

    const onSubmit = useCallback((formData: EventReminderImportForm) => {
        mutate(formData);
    }, [mutate]);

    return (
        <form
            className="flex flex-wrap justify-start gap-3"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label htmlFor="file">
                <input
                    type="file"
                    id="file"
                    disabled={isPending}
                    className="file-input file-input-bordered file-input-accent w-full max-w-xs"
                    {...register('file', {
                        required: {
                            value: true,
                            message: 'CSV file is required!',
                        },
                        validate(file: File[]) {
                            if (file.length === 0) return 'File not found!';
                            const allowedTypes = ['text/csv'];
                            if (!allowedTypes.includes(file[0]?.type)) {
                                return 'Only CSV files are allowed!';
                            }
                            return true;
                        },
                    })}
                />

                <InputError
                    message={errors.file?.message}
                    className="mt-3 mx-3"
                />
            </label>

            <button
                type="submit"
                disabled={isPending}
                className="btn btn-secondary text-lg inline-block"
            >
                {isPending ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : (
                    'Import'
                )}
            </button>
        </form>
    );
}

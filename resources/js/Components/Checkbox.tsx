import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = 'checkbox-primary checkbox-sm',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input {...props} type="checkbox" className={'checkbox ' + className} />
    );
}

import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';

/**
 * FormField Component
 * 
 * A composite component that follows DRY principles by combining
 * InputLabel, TextInput, and InputError into a single reusable field.
 * 
 * @param {string} label - The label text
 * @param {string} id - The input field ID
 * @param {string} error - Error message to display
 * @param {string} className - Additional classes for the container
 * @param {Object} inputProps - Props to pass to the TextInput component
 */
export default function FormField({
    label,
    id,
    error,
    className = '',
    children,
    ...inputProps
}) {
    return (
        <div className={className}>
            <InputLabel htmlFor={id} value={label} />
            
            {children || (
                <TextInput
                    id={id}
                    className="mt-1 block w-full"
                    {...inputProps}
                />
            )}
            
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}


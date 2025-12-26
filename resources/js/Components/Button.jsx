/**
 * Base Button Component
 * 
 * A reusable button component that follows DRY principles by consolidating
 * shared button logic and styling. Supports multiple variants.
 */
export default function Button({
    variant = 'primary',
    className = '',
    disabled,
    children,
    type = 'button',
    ...props
}) {
    const baseStyles = 'inline-flex items-center rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
        primary: 'border-transparent bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700 focus:ring-indigo-500 active:bg-gray-900',
        secondary: 'border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 active:bg-red-700',
    };

    const disabledStyles = disabled ? 'opacity-25 cursor-not-allowed' : '';
    
    return (
        <button
            {...props}
            type={type}
            className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}


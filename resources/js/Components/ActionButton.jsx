import Button from './Button';

/**
 * ActionButton Component
 * 
 * A button component that handles loading states automatically.
 * Follows DRY principles by abstracting common loading button patterns.
 * 
 * @param {boolean} loading - Whether the button is in loading state
 * @param {string} loadingText - Text to show when loading
 * @param {string} variant - Button variant (primary, secondary, danger)
 * @param {string} children - Button text when not loading
 */
export default function ActionButton({
    loading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    ...props
}) {
    return (
        <Button
            {...props}
            disabled={loading || disabled}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg 
                        className="animate-spin h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {loadingText}
                </span>
            ) : (
                children
            )}
        </Button>
    );
}


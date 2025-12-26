import { Link } from '@inertiajs/react';

/**
 * EmptyState Component
 * 
 * A reusable empty state component following DRY principles.
 * Displays an icon, title, description, and optional action button.
 * 
 * @param {string} icon - SVG icon to display (defaults to generic icon)
 * @param {string} title - Main title text
 * @param {string} description - Description text
 * @param {Object} action - Action button configuration {text, href, onClick}
 * @param {string} className - Additional classes
 */
export default function EmptyState({
    icon,
    title,
    description,
    action,
    className = '',
}) {
    const defaultIcon = (
        <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );

    return (
        <div className={`text-center py-12 ${className}`}>
            {icon || defaultIcon}
            
            <h3 className="mt-2 text-lg font-medium text-gray-900">
                {title}
            </h3>
            
            {description && (
                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            )}
            
            {action && (
                <div className="mt-6">
                    {action.href ? (
                        <Link
                            href={action.href}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {action.text}
                        </Link>
                    ) : (
                        <button
                            onClick={action.onClick}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {action.text}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}


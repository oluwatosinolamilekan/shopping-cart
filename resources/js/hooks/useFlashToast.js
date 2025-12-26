import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

/**
 * Custom Hook: useFlashToast
 * 
 * Handles flash messages from Laravel backend and displays them as toasts.
 * Follows DRY principles by centralizing flash message handling logic.
 * 
 * @param {Object} options - Configuration options for toast customization
 * @returns {Object} flash - The flash messages object
 */
export default function useFlashToast(options = {}) {
    const { flash } = usePage().props;
    
    const defaultOptions = {
        success: {
            duration: 3000,
            icon: '✓',
        },
        error: {
            duration: 4000,
        },
        warning: {
            duration: 3500,
            icon: '⚠️',
        },
        info: {
            duration: 3000,
            icon: 'ℹ️',
        },
    };

    // Merge custom options with defaults
    const toastOptions = { ...defaultOptions, ...options };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, toastOptions.success);
        }
        if (flash?.error) {
            toast.error(flash.error, toastOptions.error);
        }
        if (flash?.warning) {
            toast(flash.warning, toastOptions.warning);
        }
        if (flash?.info) {
            toast(flash.info, toastOptions.info);
        }
    }, [flash]);

    return flash;
}


import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Global error handler for Inertia requests
document.addEventListener('DOMContentLoaded', () => {
    // Intercept Inertia errors
    router.on('error', (event) => {
        // Check if it's a 419 CSRF error
        if (event.detail && event.detail.response && event.detail.response.status === 419) {
            console.warn('CSRF token mismatch detected. Please refresh the page.');
            // Optionally auto-reload: window.location.reload();
        }
    });
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

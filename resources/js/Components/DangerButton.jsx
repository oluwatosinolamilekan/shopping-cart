import Button from './Button';

/**
 * DangerButton Component
 * 
 * Wrapper around the base Button component with danger variant.
 * Maintains backward compatibility while following DRY principles.
 */
export default function DangerButton({ ...props }) {
    return <Button variant="danger" {...props} />;
}

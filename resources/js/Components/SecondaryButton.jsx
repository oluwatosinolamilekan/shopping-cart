import Button from './Button';

/**
 * SecondaryButton Component
 * 
 * Wrapper around the base Button component with secondary variant.
 * Maintains backward compatibility while following DRY principles.
 */
export default function SecondaryButton({ ...props }) {
    return <Button variant="secondary" {...props} />;
}

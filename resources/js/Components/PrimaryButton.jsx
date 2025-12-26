import Button from './Button';

/**
 * PrimaryButton Component
 * 
 * Wrapper around the base Button component with primary variant.
 * Maintains backward compatibility while following DRY principles.
 */
export default function PrimaryButton({ ...props }) {
    return <Button variant="primary" {...props} />;
}

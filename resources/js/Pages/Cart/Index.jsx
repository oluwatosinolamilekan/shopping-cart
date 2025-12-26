import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import ActionButton from '@/Components/ActionButton';
import EmptyState from '@/Components/EmptyState';
import useFlashToast from '@/hooks/useFlashToast';

export default function Index({ cartItems, total }) {
    const [updatingItem, setUpdatingItem] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);
    const [quantities, setQuantities] = useState(
        cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
    );
    
    // Use custom hook for flash messages
    useFlashToast();

    const updateQuantity = (cartItemId, productId, newQuantity) => {
        const numValue = parseInt(newQuantity) || 1;
        setQuantities(prev => ({ ...prev, [cartItemId]: Math.max(1, numValue) }));
    };

    const updateCart = (cartItemId) => {
        setUpdatingItem(cartItemId);
        
        router.patch(`/cart/${cartItemId}`, {
            quantity: quantities[cartItemId],
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setUpdatingItem(null);
            },
        });
    };

    const removeItem = (cartItemId) => {
        setRemovingItem(cartItemId);
        
        router.delete(`/cart/${cartItemId}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setRemovingItem(null);
            },
        });
    };

    const checkout = () => {
        if (confirm('Are you sure you want to checkout?')) {
            router.post('/cart/checkout');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Shopping Cart
                    </h2>
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Continue Shopping
                    </Link>
                </div>
            }
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {cartItems.length === 0 ? (
                                <EmptyState
                                    title="Your cart is empty"
                                    description="Add some products to get started"
                                    action={{
                                        text: 'Start Shopping',
                                        href: route('products.index'),
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 p-4 border rounded-lg"
                                            >
                                                {item.product.image_url && (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-24 h-24 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        ${parseFloat(item.product.price).toFixed(2)} each
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Available: {item.product.stock_quantity}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.product.stock_quantity}
                                                        value={quantities[item.id]}
                                                        onChange={(e) => updateQuantity(item.id, item.product.id, e.target.value)}
                                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    <ActionButton
                                                        onClick={() => updateCart(item.id)}
                                                        loading={updatingItem === item.id}
                                                        loadingText="Updating..."
                                                        disabled={quantities[item.id] === item.quantity}
                                                        variant="primary"
                                                        className="px-3 py-2 text-sm"
                                                    >
                                                        Update
                                                    </ActionButton>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                                    </p>
                                                </div>
                                                <ActionButton
                                                    onClick={() => removeItem(item.id)}
                                                    loading={removingItem === item.id}
                                                    loadingText="Removing..."
                                                    variant="danger"
                                                >
                                                    Remove
                                                </ActionButton>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xl font-semibold">Total:</span>
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${parseFloat(total).toFixed(2)}
                                            </span>
                                        </div>
                                        <PrimaryButton
                                            onClick={checkout}
                                            className="w-full justify-center text-lg py-3"
                                        >
                                            Proceed to Checkout
                                        </PrimaryButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


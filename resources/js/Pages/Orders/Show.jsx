import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ order }) {
    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border-blue-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calculateItemSubtotal = (price, quantity) => {
        return (parseFloat(price) * quantity).toFixed(2);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order #{order.id}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('orders.index')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Back to Orders
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Order #${order.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Order Details
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Placed on {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-lg border ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                            Order Number
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            #{order.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                            Total Items
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Card */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Order Items
                                </h3>

                                <div className="space-y-4">
                                    {order.order_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            {item.product?.image_url && (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-base font-semibold text-gray-900">
                                                    {item.product?.name || 'Product'}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    ${parseFloat(item.price).toFixed(2)} each
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    Subtotal
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    ${calculateItemSubtotal(item.price, item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total Summary */}
                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex justify-end">
                                        <div className="w-full max-w-xs space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-medium text-gray-900">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Shipping:</span>
                                                <span className="font-medium text-gray-900">Free</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Tax:</span>
                                                <span className="font-medium text-gray-900">Included</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                                <span className="text-gray-900">Total:</span>
                                                <span className="text-gray-900">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Order Information */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                                            Order Date
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                                            Last Updated
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(order.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-sm text-gray-600">
                                Need help with this order?{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Contact Support
                                </a>
                            </p>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Order Again
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


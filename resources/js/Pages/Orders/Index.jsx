import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ orders }) {
    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Orders
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
            <Head title="My Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {orders.data.length === 0 ? (
                                <div className="text-center py-12">
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        No orders yet
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        You haven't placed any orders yet.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('products.index')}
                                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.data.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="bg-gray-50 px-6 py-4 border-b">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-6">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase">
                                                                Order Number
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                #{order.id}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase">
                                                                Order Date
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {formatDate(order.created_at)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase">
                                                                Total Amount
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                ${parseFloat(order.total_amount).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                        <Link
                                                            href={route('orders.show', order.id)}
                                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-6 py-4">
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    {order.order_items.slice(0, 4).map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            {item.product?.image_url && (
                                                                <img
                                                                    src={item.product.image_url}
                                                                    alt={item.product.name}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                            )}
                                                            <div className="text-xs">
                                                                <p className="font-medium text-gray-900 truncate max-w-[150px]">
                                                                    {item.product?.name || 'Product'}
                                                                </p>
                                                                <p className="text-gray-500">
                                                                    Qty: {item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.order_items.length > 4 && (
                                                        <div className="text-sm text-gray-500">
                                                            +{order.order_items.length - 4} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Pagination */}
                        {orders.data.length > 0 && (
                            <Pagination links={orders.links} meta={orders.meta} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


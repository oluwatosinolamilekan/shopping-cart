import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import toast from 'react-hot-toast';

export default function Index({ products, pagination, filters, categories, cartCount: initialCartCount }) {
    const [addingToCart, setAddingToCart] = useState({});
    const [quantities, setQuantities] = useState({});
    const [cartCount, setCartCount] = useState(initialCartCount);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const { flash } = usePage().props;

    // Helper function to build params object with only non-empty values
    const buildParams = (additionalParams = {}) => {
        const filterMap = {
            search: searchTerm,
            category: selectedCategory,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
        };

        // Start with additional params and add only non-empty filter values
        return Object.entries({ ...additionalParams, ...filterMap })
            .reduce((acc, [key, value]) => {
                if (value) acc[key] = value;
                return acc;
            }, {});
    };

    // Sync filter state with props when filters change
    useEffect(() => {
        setSearchTerm(filters.search || '');
        setSelectedCategory(filters.category || '');
        setMinPrice(filters.min_price || '');
        setMaxPrice(filters.max_price || '');
    }, [filters.search, filters.category, filters.min_price, filters.max_price]);

    // Handle flash messages with toasts
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 3000,
                icon: '🛒',
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 4000,
            });
        }
        if (flash?.warning) {
            toast(flash.warning, {
                duration: 3500,
                icon: '⚠️',
            });
        }
    }, [flash]);

    const handleSort = (sortBy) => {
        const newSortOrder = filters.sort_by === sortBy && filters.sort_order === 'asc' ? 'desc' : 'asc';
        
        router.get(route('products.index'), buildParams({
            sort_by: sortBy,
            sort_order: newSortOrder,
        }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const goToPage = (page) => {
        router.get(route('products.index'), buildParams({ page }), {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        router.get(route('products.index'), buildParams(), {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        
        // Only preserve sort parameters when clearing filters
        const params = {};
        if (filters.sort_by) params.sort_by = filters.sort_by;
        if (filters.sort_order) params.sort_order = filters.sort_order;
        
        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const addToCart = (productId) => {
        const quantity = quantities[productId] || 1;
        
        setAddingToCart(prev => ({ ...prev, [productId]: true }));
        
        router.post('/cart/add', {
            product_id: productId,
            quantity: quantity,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setQuantities(prev => ({ ...prev, [productId]: 1 }));
                setCartCount(prev => prev + quantity);
            },
            onFinish: () => {
                setAddingToCart(prev => ({ ...prev, [productId]: false }));
            },
        });
    };

    const updateQuantity = (productId, value) => {
        const numValue = parseInt(value) || 1;
        setQuantities(prev => ({ ...prev, [productId]: Math.max(1, numValue) }));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                    <Link
                        href={route('cart.index')}
                        className="relative inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        View Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Grid Layout: Filters on Left (3/12), Products on Right (9/12) */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Left Sidebar - Filters */}
                                <div className="lg:col-span-3">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sticky top-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Filter Products
                                        </h3>
                                        
                                        <form onSubmit={handleSearch} className="space-y-4">
                                            {/* Search by name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Search by Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Enter product name..."
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                />
                                            </div>

                                            {/* Category filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                >
                                                    <option value="">All Categories</option>
                                                    {categories.map((category) => (
                                                        <option key={category.slug} value={category.slug}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Price Range */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Price Range
                                                </label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value)}
                                                        placeholder="Min ($0.00)"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value)}
                                                        placeholder="Max ($999.99)"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2 pt-2">
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    Apply Filters
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleClearFilters}
                                                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>

                                            {/* Active Filters Indicator */}
                                            {(filters.search || filters.category || filters.min_price || filters.max_price) && (
                                                <div className="pt-4 border-t border-gray-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium text-gray-700">Active Filters:</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-gray-600">
                                                        {filters.search && (
                                                            <div className="bg-indigo-50 px-2 py-1 rounded">
                                                                Search: {filters.search}
                                                            </div>
                                                        )}
                                                        {filters.category && (
                                                            <div className="bg-indigo-50 px-2 py-1 rounded">
                                                                Category: {categories.find(c => c.slug === filters.category)?.name}
                                                            </div>
                                                        )}
                                                        {filters.min_price && (
                                                            <div className="bg-indigo-50 px-2 py-1 rounded">
                                                                Min: ${filters.min_price}
                                                            </div>
                                                        )}
                                                        {filters.max_price && (
                                                            <div className="bg-indigo-50 px-2 py-1 rounded">
                                                                Max: ${filters.max_price}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </div>

                                {/* Right Content - Products */}
                                <div className="lg:col-span-9">
                                    {/* Products Count */}
                                    <div className="mb-4 text-sm text-gray-600">
                                        {pagination.total > 0 ? (
                                            <>
                                                Showing {pagination.from} to {pagination.to} of {pagination.total} products
                                                {(filters.search || filters.category || filters.min_price || filters.max_price) && (
                                                    <span className="ml-2 text-indigo-600 font-medium">(filtered)</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-gray-500">No products found</span>
                                        )}
                                    </div>

                                    {products.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Try adjusting your search or filter criteria
                                            </p>
                                            <div className="mt-6">
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                                >
                                                    {product.image_url && (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    )}
                                                    <div className="p-4">
                                                        <div className="mb-2">
                                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                                                                {product.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                ${parseFloat(product.price).toFixed(2)}
                                                            </span>
                                                            <span className={`text-sm ${
                                                                product.stock_quantity <= 10
                                                                    ? 'text-red-600 font-semibold'
                                                                    : 'text-gray-600'
                                                            }`}>
                                                                {product.stock_quantity > 0
                                                                    ? `${product.stock_quantity} in stock`
                                                                    : 'Out of stock'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="space-y-2">
                                                            {product.stock_quantity > 0 ? (
                                                                <>
                                                                    <div className="flex items-center gap-2">
                                                                        <label className="text-sm font-medium text-gray-700">
                                                                            Qty:
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max={product.stock_quantity}
                                                                            value={quantities[product.id] || 1}
                                                                            onChange={(e) => updateQuantity(product.id, e.target.value)}
                                                                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                        />
                                                                    </div>
                                                                    <PrimaryButton
                                                                        onClick={() => addToCart(product.id)}
                                                                        disabled={addingToCart[product.id]}
                                                                        className="w-full justify-center"
                                                                    >
                                                                        {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                                                                    </PrimaryButton>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="h-10"></div>
                                                                    <button
                                                                        disabled
                                                                        className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed font-semibold"
                                                                    >
                                                                        Out of Stock
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {pagination.last_page > 1 && (
                                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => goToPage(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                pagination.current_page === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => goToPage(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                                pagination.current_page === pagination.last_page
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Page <span className="font-medium">{pagination.current_page}</span> of{' '}
                                                <span className="font-medium">{pagination.last_page}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => goToPage(pagination.current_page - 1)}
                                                    disabled={pagination.current_page === 1}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                                                        pagination.current_page === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                
                                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                                                    // Show first page, last page, current page, and pages around current
                                                    if (
                                                        page === 1 ||
                                                        page === pagination.last_page ||
                                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => goToPage(page)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    page === pagination.current_page
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    } else if (
                                                        page === pagination.current_page - 2 ||
                                                        page === pagination.current_page + 2
                                                    ) {
                                                        return (
                                                            <span
                                                                key={page}
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                            >
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                
                                                <button
                                                    onClick={() => goToPage(pagination.current_page + 1)}
                                                    disabled={pagination.current_page === pagination.last_page}
                                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                                                        pagination.current_page === pagination.last_page
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


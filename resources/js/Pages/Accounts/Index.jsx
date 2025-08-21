import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ accounts }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Accounts
                    </h2>
                    <Link 
                        href="/accounts/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        New Account
                    </Link>
                </div>
            }
        >
            <Head title="Accounts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {accounts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {accounts.map((account) => (
                                <div key={account.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                                                </h3>
                                                <p className="text-sm text-gray-500">{account.account_number}</p>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                account.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {account.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(account.balance)}
                                            </p>
                                            <p className="text-sm text-gray-500">{account.currency}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <Link 
                                                href={`/accounts/${account.id}`}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                            <Link 
                                                href={`/accounts/${account.id}/edit`}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
                                <p className="text-gray-500 mb-4">Get started by creating your first account.</p>
                                <Link 
                                    href="/accounts/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                                >
                                    Create Your First Account
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}






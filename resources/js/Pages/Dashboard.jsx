import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ accounts = [], recentTransactions = [], totalBalance = 0, monthlyStats = {} }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    BanK
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-blue-600 p-6 rounded-lg shadow-lg text-white">
                            <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
                            <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                        </div>
                        <div className="bg-green-600 p-6 rounded-lg shadow-lg text-white">
                            <h3 className="text-sm font-medium opacity-90">Monthly Credits</h3>
                            <p className="text-2xl font-bold">{formatCurrency(monthlyStats.credits || 0)}</p>
                        </div>
                        <div className="bg-red-600 p-6 rounded-lg shadow-lg text-white">
                            <h3 className="text-sm font-medium opacity-90">Monthly Debits</h3>
                            <p className="text-2xl font-bold">{formatCurrency(monthlyStats.debits || 0)}</p>
                        </div>
                        <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white">
                            <h3 className="text-sm font-medium opacity-90">Transfers</h3>
                            <p className="text-2xl font-bold">{formatCurrency(monthlyStats.transfers || 0)}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link 
                                    href="/accounts/create"
                                    className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-white text-sm font-bold">+</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">New Account</span>
                                </Link>
                                <Link 
                                    href="/transactions/create"
                                    className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-white text-sm font-bold">$</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Transfer Money</span>
                                </Link>
                                <Link 
                                    href="/accounts"
                                    className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-white text-sm font-bold">A</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">View Accounts</span>
                                </Link>
                                <Link 
                                    href="/transactions"
                                    className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mb-2">
                                        <span className="text-white text-sm font-bold">T</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Transaction History</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Accounts List */}
                    {accounts.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Accounts</h3>
                                <div className="space-y-4">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{account.account_number}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {formatCurrency(account.balance)}
                                                    </p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        account.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {account.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

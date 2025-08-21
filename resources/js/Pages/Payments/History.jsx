import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function History({ payments }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Payment History
                    </h2>
                    <Link href={route('payments.create')}>
                        <PrimaryButton className="bg-green-600 hover:bg-green-700">
                            Make Payment
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Payment History" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {payments.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💳</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        No Payments Yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        You haven't made any payments through Stripe yet.
                                    </p>
                                    <Link href={route('payments.create')}>
                                        <PrimaryButton className="bg-green-600 hover:bg-green-700">
                                            Make Your First Payment
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Stripe Payments
                                        </h3>
                                        <p className="text-gray-600">
                                            All payments processed through Stripe are listed here.
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date & Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Account
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Reference
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {payments.data.map((payment) => (
                                                    <tr key={payment.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDate(payment.created_at)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div>
                                                                <div className="font-medium">
                                                                    {payment.account.account_type}
                                                                </div>
                                                                <div className="text-gray-500">
                                                                    {payment.account.account_number}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            <div className="max-w-xs truncate" title={payment.description}>
                                                                {payment.description}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <span className="text-green-600">
                                                                +${parseFloat(payment.amount).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(payment.status)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                            {payment.reference_number}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {payments.links.length > 3 && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                Showing {payments.from} to {payments.to} of {payments.total} payments
                                            </div>
                                            <div className="flex space-x-1">
                                                {payments.links.map((link, index) => (
                                                    link.url ? (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                                link.active
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


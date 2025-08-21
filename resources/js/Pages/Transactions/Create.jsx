import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ accounts }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        account_id: '',
        transaction_type: 'credit',
        amount: '',
        description: '',
        to_account_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    New Transaction
                </h2>
            }
        >
            <Head title="New Transaction" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-6">
                                <InputLabel htmlFor="account_id" value="From Account" />
                                <select
                                    id="account_id"
                                    name="account_id"
                                    value={data.account_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('account_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.account_number} - {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} 
                                            (${account.balance})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.account_id} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="transaction_type" value="Transaction Type" />
                                <select
                                    id="transaction_type"
                                    name="transaction_type"
                                    value={data.transaction_type}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('transaction_type', e.target.value)}
                                >
                                    <option value="credit">Deposit (Credit)</option>
                                    <option value="debit">Withdrawal (Debit)</option>
                                    <option value="transfer">Transfer to Another Account</option>
                                </select>
                                <InputError message={errors.transaction_type} className="mt-2" />
                            </div>

                            {data.transaction_type === 'transfer' && (
                                <div className="mb-6">
                                    <InputLabel htmlFor="to_account_number" value="To Account Number" />
                                    <TextInput
                                        id="to_account_number"
                                        type="text"
                                        name="to_account_number"
                                        value={data.to_account_number}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('to_account_number', e.target.value)}
                                        placeholder="Enter destination account number"
                                        required={data.transaction_type === 'transfer'}
                                    />
                                    <InputError message={errors.to_account_number} className="mt-2" />
                                </div>
                            )}

                            <div className="mb-6">
                                <InputLabel htmlFor="amount" value="Amount" />
                                <TextInput
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={data.amount}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('amount', e.target.value)}
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    required
                                />
                                <InputError message={errors.amount} className="mt-2" />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="description" value="Description" />
                                <TextInput
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter transaction description"
                                    required
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {data.transaction_type && data.amount && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                                    <h4 className="font-medium text-yellow-900 mb-2">Transaction Summary</h4>
                                    <div className="text-sm text-yellow-700">
                                        <p><strong>Type:</strong> {data.transaction_type.charAt(0).toUpperCase() + data.transaction_type.slice(1)}</p>
                                        <p><strong>Amount:</strong> ${data.amount}</p>
                                        {data.transaction_type === 'transfer' && data.to_account_number && (
                                            <p><strong>To Account:</strong> {data.to_account_number}</p>
                                        )}
                                        {data.description && <p><strong>Description:</strong> {data.description}</p>}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <Link
                                    href="/transactions"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Process Transaction
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}






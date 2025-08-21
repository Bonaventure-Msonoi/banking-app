import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        account_type: 'checking',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('accounts.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Account
                </h2>
            }
        >
            <Head title="Create Account" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-6">
                                <InputLabel htmlFor="account_type" value="Account Type" />
                                <select
                                    id="account_type"
                                    name="account_type"
                                    value={data.account_type}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('account_type', e.target.value)}
                                >
                                    <option value="checking">Checking Account</option>
                                    <option value="savings">Savings Account</option>
                                </select>
                                <InputError message={errors.account_type} className="mt-2" />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                                <h4 className="font-medium text-blue-900 mb-2">Account Information</h4>
                                <p className="text-sm text-blue-700">
                                    • Your account number will be automatically generated<br/>
                                    • Initial balance will be $0.00<br/>
                                    • Account will be active by default<br/>
                                    • Currency will be set to USD
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href="/accounts"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Create Account
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}






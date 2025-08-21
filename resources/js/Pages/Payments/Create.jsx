import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import FlashMessage from '@/Components/FlashMessage';

const stripePromise = loadStripe(window.stripeKey || '');

export default function Create({ accounts, stripe_key }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        account_id: '',
        description: '',
    });

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessingPayment(true);
        setPaymentError('');

        try {
            // Create payment intent
            const response = await fetch('/payments/payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create payment intent');
            }

            // For demo purposes, simulate a successful payment
            // In a real implementation, you would use Stripe Elements here
            const simulatedPaymentIntent = {
                id: result.payment_intent_id,
                status: 'succeeded'
            };

            if (simulatedPaymentIntent.status === 'succeeded') {
                // Handle successful payment
                const successResponse = await fetch('/payments/success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        payment_intent_id: result.payment_intent_id,
                        account_id: data.account_id,
                    }),
                });

                const successResult = await successResponse.json();

                if (successResponse.ok) {
                    setPaymentSuccess(true);
                    reset();
                } else {
                    throw new Error(successResult.error || 'Failed to process payment');
                }
            }
        } catch (error) {
            setPaymentError(error.message);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Make a Payment
                </h2>
            }
        >
            <Head title="Make Payment" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {paymentSuccess && (
                                <FlashMessage
                                    type="success"
                                    message="🎉 Payment processed successfully! Your account has been credited."
                                />
                            )}

                            {paymentError && (
                                <FlashMessage
                                    type="error"
                                    message={paymentError}
                                />
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="account_id" value="Select Account" />
                                    <select
                                        id="account_id"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.account_id}
                                        onChange={(e) => setData('account_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Choose an account</option>
                                        {accounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.account_type} - {account.account_number} 
                                                (Balance: ${parseFloat(account.balance).toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.account_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="amount" value="Amount ($)" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.amount}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('amount', e.target.value)}
                                        required
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextInput
                                        id="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                        placeholder="Payment description..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <div className="text-gray-500 mb-4">
                                        💳 Demo Payment Mode
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        This is a simplified demo version. In production, this would show 
                                        Stripe Elements for secure card input. For now, clicking "Pay" 
                                        will simulate a successful payment and credit your account.
                                    </p>
                                    <div className="bg-green-50 p-4 rounded border text-left">
                                        <div className="text-sm text-green-700">
                                            <strong>Demo Mode:</strong><br />
                                            ✅ Payment will be simulated as successful<br />
                                            ✅ Account balance will be updated<br />
                                            ✅ Transaction will be recorded
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton 
                                        disabled={processing || isProcessingPayment}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isProcessingPayment ? 'Processing Payment...' : `Pay $${data.amount || '0.00'} (Demo)`}
                                    </PrimaryButton>

                                    <SecondaryButton
                                        type="button"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </form>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                    🔒 Demo Notice
                                </h3>
                                <p className="text-blue-700 text-sm">
                                    This is a demo version that simulates successful payments. 
                                    Your account will be credited and transactions will be recorded 
                                    in the database for testing purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
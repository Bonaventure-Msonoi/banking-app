<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Show the payment form
     */
    public function create()
    {
        $accounts = auth()->user()->accounts;
        
        return Inertia::render('Payments/Create', [
            'accounts' => $accounts,
            'stripe_key' => config('services.stripe.key'),
        ]);
    }

    /**
     * Create a payment intent
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'account_id' => 'required|exists:accounts,id',
            'description' => 'required|string|max:255',
        ]);

        try {
            // Verify user owns the account
            $account = Account::findOrFail($request->account_id);
            if ($account->user_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Create or get Stripe customer
            $user = auth()->user();
            if (!$user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            // Create payment intent
            $paymentIntent = $this->stripeService->createPaymentIntentWithCustomer(
                $request->amount,
                $user->stripe_id,
                'usd',
                [
                    'account_id' => $request->account_id,
                    'description' => $request->description,
                    'user_id' => $user->id,
                ]
            );

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle successful payment
     */
    public function handleSuccess(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
            'account_id' => 'required|exists:accounts,id',
        ]);

        try {
            // Verify user owns the account
            $account = Account::findOrFail($request->account_id);
            if ($account->user_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Retrieve and verify payment intent
            $paymentIntent = $this->stripeService->retrievePaymentIntent($request->payment_intent_id);
            
            if ($paymentIntent->status !== 'succeeded') {
                return response()->json(['error' => 'Payment not completed'], 400);
            }

            DB::beginTransaction();

            try {
                // Create transaction record
                $transaction = new Transaction();
                $transaction->account_id = $request->account_id;
                $transaction->transaction_type = 'credit';
                $transaction->amount = $paymentIntent->amount / 100; // Convert from cents
                $transaction->description = $paymentIntent->metadata->description ?? 'Stripe Payment';
                $transaction->reference_number = 'STRIPE_' . $paymentIntent->id;
                $transaction->status = 'completed';
                $transaction->metadata = [
                    'payment_intent_id' => $paymentIntent->id,
                    'payment_method' => $paymentIntent->payment_method,
                    'stripe_fee' => $paymentIntent->application_fee_amount ?? 0,
                ];

                // Update account balance
                $account->balance += $transaction->amount;
                $account->save();
                $transaction->save();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'transaction' => $transaction,
                    'message' => 'Payment processed successfully!',
                ]);

            } catch (Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle payment failure
     */
    public function handleFailure(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            $paymentIntent = $this->stripeService->retrievePaymentIntent($request->payment_intent_id);
            
            // Log the failed payment attempt
            \Log::warning('Payment failed', [
                'payment_intent_id' => $paymentIntent->id,
                'user_id' => auth()->id(),
                'status' => $paymentIntent->status,
                'last_payment_error' => $paymentIntent->last_payment_error,
            ]);

            return response()->json([
                'error' => 'Payment failed',
                'details' => $paymentIntent->last_payment_error->message ?? 'Unknown error',
            ], 400);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show payment history
     */
    public function history()
    {
        $user = auth()->user();
        
        // Get all payment transactions
        $payments = Transaction::whereHas('account', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('reference_number', 'LIKE', 'STRIPE_%')
        ->with('account')
        ->orderBy('created_at', 'desc')
        ->paginate(20);

        return Inertia::render('Payments/History', [
            'payments' => $payments,
        ]);
    }

    /**
     * Get payment methods for the user
     */
    public function getPaymentMethods()
    {
        try {
            $user = auth()->user();
            
            if (!$user->stripe_id) {
                return response()->json(['payment_methods' => []]);
            }

            $paymentMethods = $this->stripeService->getCustomerPaymentMethods($user->stripe_id);

            return response()->json(['payment_methods' => $paymentMethods->data]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Save a payment method for future use
     */
    public function savePaymentMethod(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|string',
        ]);

        try {
            $user = auth()->user();
            
            if (!$user->stripe_id) {
                $user->createAsStripeCustomer();
            }

            $paymentMethod = $this->stripeService->attachPaymentMethod(
                $request->payment_method_id,
                $user->stripe_id
            );

            return response()->json([
                'success' => true,
                'payment_method' => $paymentMethod,
                'message' => 'Payment method saved successfully!',
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}


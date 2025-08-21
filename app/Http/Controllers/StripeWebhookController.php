<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;

class StripeWebhookController extends CashierController
{
    /**
     * Handle payment intent succeeded event
     */
    public function handlePaymentIntentSucceeded($payload)
    {
        Log::info('Payment intent succeeded', ['payload' => $payload]);

        $paymentIntent = $payload['data']['object'];
        
        // Update transaction status if needed
        $transaction = Transaction::where('reference_number', 'STRIPE_' . $paymentIntent['id'])->first();
        
        if ($transaction && $transaction->status !== 'completed') {
            $transaction->status = 'completed';
            $transaction->save();
            
            Log::info('Transaction updated to completed', ['transaction_id' => $transaction->id]);
        }

        return $this->successMethod();
    }

    /**
     * Handle payment intent payment failed event
     */
    public function handlePaymentIntentPaymentFailed($payload)
    {
        Log::warning('Payment intent failed', ['payload' => $payload]);

        $paymentIntent = $payload['data']['object'];
        
        // Update transaction status
        $transaction = Transaction::where('reference_number', 'STRIPE_' . $paymentIntent['id'])->first();
        
        if ($transaction) {
            $transaction->status = 'failed';
            $transaction->metadata = array_merge($transaction->metadata ?? [], [
                'failure_reason' => $paymentIntent['last_payment_error']['message'] ?? 'Unknown error'
            ]);
            $transaction->save();
            
            Log::info('Transaction updated to failed', ['transaction_id' => $transaction->id]);
        }

        return $this->successMethod();
    }

    /**
     * Handle customer created event
     */
    public function handleCustomerCreated($payload)
    {
        Log::info('Customer created', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle customer updated event
     */
    public function handleCustomerUpdated($payload)
    {
        Log::info('Customer updated', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle subscription created event
     */
    public function handleCustomerSubscriptionCreated($payload)
    {
        Log::info('Subscription created', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle subscription updated event
     */
    public function handleCustomerSubscriptionUpdated($payload)
    {
        Log::info('Subscription updated', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle subscription deleted event
     */
    public function handleCustomerSubscriptionDeleted($payload)
    {
        Log::info('Subscription deleted', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle invoice payment succeeded event
     */
    public function handleInvoicePaymentSucceeded($payload)
    {
        Log::info('Invoice payment succeeded', ['payload' => $payload]);
        
        return $this->successMethod();
    }

    /**
     * Handle invoice payment failed event
     */
    public function handleInvoicePaymentFailed($payload)
    {
        Log::warning('Invoice payment failed', ['payload' => $payload]);
        
        return $this->successMethod();
    }
}


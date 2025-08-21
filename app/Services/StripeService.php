<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Customer;
use Stripe\PaymentMethod;
use Exception;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a payment intent for a one-time payment
     */
    public function createPaymentIntent(float $amount, string $currency = 'usd', array $metadata = [])
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount * 100, // Stripe expects amount in cents
                'currency' => $currency,
                'metadata' => $metadata,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return $paymentIntent;
        } catch (Exception $e) {
            throw new Exception('Error creating payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Create a payment intent with a customer
     */
    public function createPaymentIntentWithCustomer(float $amount, string $customerId, string $currency = 'usd', array $metadata = [])
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount * 100,
                'currency' => $currency,
                'customer' => $customerId,
                'metadata' => $metadata,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return $paymentIntent;
        } catch (Exception $e) {
            throw new Exception('Error creating payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Retrieve a payment intent
     */
    public function retrievePaymentIntent(string $paymentIntentId)
    {
        try {
            return PaymentIntent::retrieve($paymentIntentId);
        } catch (Exception $e) {
            throw new Exception('Error retrieving payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Confirm a payment intent
     */
    public function confirmPaymentIntent(string $paymentIntentId, array $paymentMethod = [])
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            
            if (!empty($paymentMethod)) {
                $paymentIntent->confirm(['payment_method' => $paymentMethod]);
            } else {
                $paymentIntent->confirm();
            }

            return $paymentIntent;
        } catch (Exception $e) {
            throw new Exception('Error confirming payment intent: ' . $e->getMessage());
        }
    }

    /**
     * Create or retrieve a Stripe customer
     */
    public function createOrRetrieveCustomer(string $email, string $name = null, array $metadata = [])
    {
        try {
            // Try to find existing customer
            $customers = Customer::all(['email' => $email, 'limit' => 1]);
            
            if (!empty($customers->data)) {
                return $customers->data[0];
            }

            // Create new customer
            return Customer::create([
                'email' => $email,
                'name' => $name,
                'metadata' => $metadata,
            ]);
        } catch (Exception $e) {
            throw new Exception('Error creating/retrieving customer: ' . $e->getMessage());
        }
    }

    /**
     * Attach a payment method to a customer
     */
    public function attachPaymentMethod(string $paymentMethodId, string $customerId)
    {
        try {
            $paymentMethod = PaymentMethod::retrieve($paymentMethodId);
            $paymentMethod->attach(['customer' => $customerId]);
            
            return $paymentMethod;
        } catch (Exception $e) {
            throw new Exception('Error attaching payment method: ' . $e->getMessage());
        }
    }

    /**
     * Get customer's payment methods
     */
    public function getCustomerPaymentMethods(string $customerId, string $type = 'card')
    {
        try {
            return PaymentMethod::all([
                'customer' => $customerId,
                'type' => $type,
            ]);
        } catch (Exception $e) {
            throw new Exception('Error retrieving payment methods: ' . $e->getMessage());
        }
    }
}


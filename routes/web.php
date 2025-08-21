<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SupabaseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Accounts
    Route::resource('accounts', AccountController::class);
    
    // Transactions
    Route::resource('transactions', TransactionController::class);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Payments & Stripe Integration
    Route::prefix('payments')->group(function () {
        Route::get('/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('/payment-intent', [PaymentController::class, 'createPaymentIntent'])->name('payments.intent');
        Route::post('/success', [PaymentController::class, 'handleSuccess'])->name('payments.success');
        Route::post('/failure', [PaymentController::class, 'handleFailure'])->name('payments.failure');
        Route::get('/history', [PaymentController::class, 'history'])->name('payments.history');
        Route::get('/methods', [PaymentController::class, 'getPaymentMethods'])->name('payments.methods');
        Route::post('/methods/save', [PaymentController::class, 'savePaymentMethod'])->name('payments.methods.save');
    });
    
    // Supabase Integration
    Route::prefix('supabase')->group(function () {
        Route::get('/config', [SupabaseController::class, 'config'])->name('supabase.config');
        Route::post('/sync', [SupabaseController::class, 'syncToSupabase'])->name('supabase.sync');
        Route::get('/transactions/realtime', [SupabaseController::class, 'getRealtimeTransactions'])->name('supabase.transactions');
        Route::get('/analytics', [SupabaseController::class, 'getAnalytics'])->name('supabase.analytics');
        Route::post('/upload', [SupabaseController::class, 'uploadFile'])->name('supabase.upload');
        Route::post('/query', [SupabaseController::class, 'query'])->name('supabase.query');
    });
});

// Stripe Webhooks (outside of auth middleware)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook')
    ->withoutMiddleware(['web', 'auth']);

require __DIR__.'/auth.php';

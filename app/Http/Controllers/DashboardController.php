<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get user's accounts with recent transactions
        $accounts = $user->accounts()->with(['transactions' => function($query) {
            $query->latest()->limit(5);
        }])->get();

        // Get recent transactions across all accounts
        $recentTransactions = Transaction::whereHas('account', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['account', 'toAccount'])
        ->latest()
        ->limit(10)
        ->get();

        // Calculate total balance
        $totalBalance = $accounts->sum('balance');

        // Get monthly transaction summary
        $monthlyTransactions = Transaction::whereHas('account', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->selectRaw('transaction_type, SUM(amount) as total')
        ->groupBy('transaction_type')
        ->get()
        ->keyBy('transaction_type');

        return Inertia::render('Dashboard', [
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'totalBalance' => $totalBalance,
            'monthlyStats' => [
                'credits' => $monthlyTransactions->get('credit', (object)['total' => 0])->total,
                'debits' => $monthlyTransactions->get('debit', (object)['total' => 0])->total,
                'transfers' => $monthlyTransactions->get('transfer', (object)['total' => 0])->total,
            ]
        ]);
    }
}

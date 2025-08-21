<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = auth()->user()->accounts()->with('transactions')->get();
        
        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Accounts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_type' => 'required|in:checking,savings',
        ]);

        $account = new Account();
        $account->user_id = auth()->id();
        $account->account_number = $this->generateAccountNumber();
        $account->account_type = $request->account_type;
        $account->balance = 0;
        $account->currency = 'USD';
        $account->is_active = true;
        $account->save();

        return redirect()->route('accounts.index')->with('success', 'Account created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        // Ensure user can only view their own accounts
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        $account->load(['transactions' => function($query) {
            $query->with(['toAccount'])->latest();
        }]);

        return Inertia::render('Accounts/Show', [
            'account' => $account
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Accounts/Edit', [
            'account' => $account
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'account_type' => 'required|in:checking,savings',
            'is_active' => 'boolean',
        ]);

        $account->update($request->only(['account_type', 'is_active']));

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        if ($account->balance != 0) {
            return back()->with('error', 'Cannot delete account with non-zero balance.');
        }

        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account deleted successfully!');
    }

    private function generateAccountNumber(): string
    {
        do {
            $accountNumber = 'ACC' . str_pad(rand(1, 999999999), 9, '0', STR_PAD_LEFT);
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }
}

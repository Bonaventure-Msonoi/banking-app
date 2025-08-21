<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::whereHas('account', function($query) {
            $query->where('user_id', auth()->id());
        })
        ->with(['account', 'toAccount'])
        ->latest()
        ->paginate(20);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $accounts = auth()->user()->accounts()->where('is_active', true)->get();
        
        return Inertia::render('Transactions/Create', [
            'accounts' => $accounts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'transaction_type' => 'required|in:debit,credit,transfer',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'to_account_number' => 'required_if:transaction_type,transfer|string',
        ]);

        // Verify user owns the account
        $account = Account::findOrFail($request->account_id);
        if ($account->user_id !== auth()->id()) {
            abort(403);
        }

        DB::beginTransaction();
        
        try {
            $transaction = new Transaction();
            $transaction->account_id = $request->account_id;
            $transaction->transaction_type = $request->transaction_type;
            $transaction->amount = $request->amount;
            $transaction->description = $request->description;
            $transaction->reference_number = $this->generateReferenceNumber();
            $transaction->status = 'completed';

            // Handle different transaction types
            switch ($request->transaction_type) {
                case 'debit':
                    if ($account->balance < $request->amount) {
                        throw new \Exception('Insufficient funds');
                    }
                    $account->balance -= $request->amount;
                    break;
                    
                case 'credit':
                    $account->balance += $request->amount;
                    break;
                    
                case 'transfer':
                    $toAccount = Account::where('account_number', $request->to_account_number)->first();
                    if (!$toAccount) {
                        throw new \Exception('Destination account not found');
                    }
                    if ($account->balance < $request->amount) {
                        throw new \Exception('Insufficient funds');
                    }
                    
                    $transaction->to_account_id = $toAccount->id;
                    $account->balance -= $request->amount;
                    $toAccount->balance += $request->amount;
                    $toAccount->save();
                    
                    // Create corresponding credit transaction for destination account
                    $creditTransaction = new Transaction();
                    $creditTransaction->account_id = $toAccount->id;
                    $creditTransaction->transaction_type = 'credit';
                    $creditTransaction->amount = $request->amount;
                    $creditTransaction->description = "Transfer from " . $account->account_number;
                    $creditTransaction->reference_number = $this->generateReferenceNumber();
                    $creditTransaction->status = 'completed';
                    $creditTransaction->save();
                    break;
            }

            $account->save();
            $transaction->save();

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaction completed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        // Ensure user can only view their own transactions
        if ($transaction->account->user_id !== auth()->id()) {
            abort(403);
        }

        $transaction->load(['account', 'toAccount']);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        // Transactions should not be editable for security reasons
        abort(403, 'Transactions cannot be edited');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Transactions should not be editable for security reasons
        abort(403, 'Transactions cannot be edited');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        // Transactions should not be deletable for audit trail
        abort(403, 'Transactions cannot be deleted');
    }

    private function generateReferenceNumber(): string
    {
        do {
            $referenceNumber = 'TXN' . strtoupper(uniqid());
        } while (Transaction::where('reference_number', $referenceNumber)->exists());

        return $referenceNumber;
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a demo user
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Create demo accounts
        $checkingAccount = Account::create([
            'user_id' => $user->id,
            'account_number' => 'ACC123456789',
            'account_type' => 'checking',
            'balance' => 2500.00,
            'currency' => 'USD',
            'is_active' => true,
        ]);

        $savingsAccount = Account::create([
            'user_id' => $user->id,
            'account_number' => 'ACC987654321',
            'account_type' => 'savings',
            'balance' => 10000.00,
            'currency' => 'USD',
            'is_active' => true,
        ]);

        // Create demo transactions
        Transaction::create([
            'account_id' => $checkingAccount->id,
            'transaction_type' => 'credit',
            'amount' => 3000.00,
            'description' => 'Initial deposit',
            'reference_number' => 'TXN001',
            'status' => 'completed',
        ]);

        Transaction::create([
            'account_id' => $checkingAccount->id,
            'transaction_type' => 'debit',
            'amount' => 500.00,
            'description' => 'ATM withdrawal',
            'reference_number' => 'TXN002',
            'status' => 'completed',
        ]);

        Transaction::create([
            'account_id' => $savingsAccount->id,
            'transaction_type' => 'credit',
            'amount' => 10000.00,
            'description' => 'Initial savings deposit',
            'reference_number' => 'TXN003',
            'status' => 'completed',
        ]);

        Transaction::create([
            'account_id' => $checkingAccount->id,
            'transaction_type' => 'transfer',
            'amount' => 200.00,
            'description' => 'Transfer to savings',
            'reference_number' => 'TXN004',
            'to_account_id' => $savingsAccount->id,
            'status' => 'completed',
        ]);

        // Update account balances to match transactions
        $checkingAccount->update(['balance' => 2300.00]); // 3000 - 500 - 200
        $savingsAccount->update(['balance' => 10200.00]); // 10000 + 200

        $this->command->info('Demo banking data created successfully!');
        $this->command->info('Login with: demo@example.com / password');
    }
}

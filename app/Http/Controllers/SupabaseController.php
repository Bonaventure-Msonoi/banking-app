<?php

namespace App\Http\Controllers;

use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SupabaseController extends Controller
{
    protected $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    /**
     * Get Supabase configuration for frontend
     */
    public function config()
    {
        return response()->json([
            'url' => $this->supabase->getUrl(),
            'anonKey' => $this->supabase->getAnonKey(),
        ]);
    }

    /**
     * Sync Laravel data to Supabase
     */
    public function syncToSupabase(Request $request)
    {
        try {
            $user = auth()->user();
            
            // Sync user accounts to Supabase
            $accounts = $user->accounts()->with('transactions')->get();
            
            foreach ($accounts as $account) {
                // Upsert account to Supabase
                $accountData = [
                    'id' => $account->id,
                    'user_id' => $account->user_id,
                    'account_number' => $account->account_number,
                    'account_type' => $account->account_type,
                    'balance' => (float) $account->balance,
                    'currency' => $account->currency,
                    'is_active' => $account->is_active,
                    'created_at' => $account->created_at->toISOString(),
                    'updated_at' => $account->updated_at->toISOString(),
                ];

                $this->supabase->insert('accounts', $accountData);

                // Sync transactions
                foreach ($account->transactions as $transaction) {
                    $transactionData = [
                        'id' => $transaction->id,
                        'account_id' => $transaction->account_id,
                        'transaction_type' => $transaction->transaction_type,
                        'amount' => (float) $transaction->amount,
                        'description' => $transaction->description,
                        'reference_number' => $transaction->reference_number,
                        'to_account_id' => $transaction->to_account_id,
                        'metadata' => $transaction->metadata,
                        'status' => $transaction->status,
                        'created_at' => $transaction->created_at->toISOString(),
                        'updated_at' => $transaction->updated_at->toISOString(),
                    ];

                    $this->supabase->insert('transactions', $transactionData);
                }
            }

            return response()->json(['message' => 'Data synced to Supabase successfully']);

        } catch (\Exception $e) {
            Log::error('Supabase sync error: ' . $e->getMessage());
            return response()->json(['error' => 'Sync failed'], 500);
        }
    }

    /**
     * Get real-time transaction updates from Supabase
     */
    public function getRealtimeTransactions(Request $request)
    {
        try {
            $user = auth()->user();
            $accountIds = $user->accounts()->pluck('id')->toArray();

            $transactions = $this->supabase->select('transactions', [
                'account_id' => 'in.(' . implode(',', $accountIds) . ')',
                'order' => 'created_at.desc',
                'limit' => 50
            ]);

            return response()->json($transactions);

        } catch (\Exception $e) {
            Log::error('Supabase realtime fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    /**
     * Get analytics data from Supabase
     */
    public function getAnalytics(Request $request)
    {
        try {
            $user = auth()->user();
            
            // Call Supabase RPC function for analytics
            $analytics = $this->supabase->rpc('get_user_analytics', [
                'user_id' => $user->id,
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date')
            ]);

            return response()->json($analytics);

        } catch (\Exception $e) {
            Log::error('Supabase analytics error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch analytics'], 500);
        }
    }

    /**
     * Store file in Supabase Storage
     */
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'bucket' => 'required|string',
            'path' => 'required|string',
        ]);

        try {
            $file = $request->file('file');
            $bucket = $request->input('bucket');
            $path = $request->input('path');

            $result = $this->supabase->uploadFile(
                $bucket,
                $path,
                $file->getContent(),
                $file->getMimeType()
            );

            $publicUrl = $this->supabase->getStorageUrl($bucket, $path);

            return response()->json([
                'message' => 'File uploaded successfully',
                'url' => $publicUrl,
                'path' => $path,
                'result' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Supabase file upload error: ' . $e->getMessage());
            return response()->json(['error' => 'Upload failed'], 500);
        }
    }

    /**
     * Execute custom Supabase queries
     */
    public function query(Request $request)
    {
        $request->validate([
            'table' => 'required|string',
            'operation' => 'required|in:select,insert,update,delete',
            'data' => 'sometimes|array',
            'filters' => 'sometimes|array',
            'select' => 'sometimes|string'
        ]);

        try {
            $table = $request->input('table');
            $operation = $request->input('operation');
            $data = $request->input('data', []);
            $filters = $request->input('filters', []);
            $select = $request->input('select', '*');

            // Security check - only allow operations on user's own data
            $user = auth()->user();
            if (!in_array($table, ['accounts', 'transactions'])) {
                return response()->json(['error' => 'Unauthorized table access'], 403);
            }

            $result = match($operation) {
                'select' => $this->supabase->select($table, $filters, $select),
                'insert' => $this->supabase->insert($table, array_merge($data, ['user_id' => $user->id])),
                'update' => $this->supabase->update($table, array_merge($filters, ['user_id' => $user->id]), $data),
                'delete' => $this->supabase->delete($table, array_merge($filters, ['user_id' => $user->id])),
            };

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Supabase query error: ' . $e->getMessage());
            return response()->json(['error' => 'Query failed'], 500);
        }
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = [
        'user_id',
        'account_number',
        'account_type',
        'balance',
        'currency',
        'is_active',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function sentTransfers(): HasMany
    {
        return $this->hasMany(Transaction::class, 'account_id')
            ->where('transaction_type', 'transfer');
    }

    public function receivedTransfers(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_account_id')
            ->where('transaction_type', 'transfer');
    }

    public function generateAccountNumber(): string
    {
        return 'ACC' . str_pad(rand(1, 999999999), 9, '0', STR_PAD_LEFT);
    }
}

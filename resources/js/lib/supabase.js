import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from Laravel backend
const supabaseUrl = window.supabaseConfig?.url || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = window.supabaseConfig?.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Banking-specific helpers
export const supabaseHelpers = {
  // Real-time transaction updates
  subscribeToTransactions: (userId, callback) => {
    return supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Real-time account balance updates
  subscribeToAccounts: (userId, callback) => {
    return supabase
      .channel('accounts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'accounts',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  // Upload transaction receipts
  uploadReceipt: async (transactionId, file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${transactionId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { data, error } = await supabase.storage
      .from('transaction-receipts')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('transaction-receipts')
      .getPublicUrl(filePath)

    return { path: filePath, url: publicUrl }
  },

  // Get transaction analytics
  getTransactionAnalytics: async (userId, startDate, endDate) => {
    const { data, error } = await supabase.rpc('get_transaction_analytics', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    })

    if (error) throw error
    return data
  },

  // Search transactions
  searchTransactions: async (userId, searchTerm) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        accounts!inner(user_id, account_number, account_type)
      `)
      .eq('accounts.user_id', userId)
      .or(`description.ilike.%${searchTerm}%,reference_number.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get account insights
  getAccountInsights: async (accountId) => {
    const { data, error } = await supabase.rpc('get_account_insights', {
      account_id: accountId,
    })

    if (error) throw error
    return data
  },
}

export default supabase






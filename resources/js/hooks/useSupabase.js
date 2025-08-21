import { useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { router } from '@inertiajs/react';

export const useSupabase = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Supabase connection
        const initializeSupabase = async () => {
            try {
                // Test connection
                const { data, error } = await supabase.from('accounts').select('count').limit(1);
                setIsConnected(!error);
            } catch (error) {
                console.error('Supabase connection failed:', error);
                setIsConnected(false);
            } finally {
                setLoading(false);
            }
        };

        initializeSupabase();
    }, []);

    return {
        supabase,
        supabaseHelpers,
        isConnected,
        loading,
    };
};

export const useRealtimeTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        // Subscribe to real-time transaction updates
        const channel = supabaseHelpers.subscribeToTransactions(userId, (payload) => {
            console.log('Transaction update:', payload);
            
            // Update local state based on the change
            switch (payload.eventType) {
                case 'INSERT':
                    setTransactions(prev => [payload.new, ...prev]);
                    // Show notification or refresh page
                    router.reload({ only: ['recentTransactions'] });
                    break;
                case 'UPDATE':
                    setTransactions(prev => 
                        prev.map(t => t.id === payload.new.id ? payload.new : t)
                    );
                    break;
                case 'DELETE':
                    setTransactions(prev => 
                        prev.filter(t => t.id !== payload.old.id)
                    );
                    break;
            }
        });

        // Cleanup subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { transactions, loading };
};

export const useRealtimeAccounts = (userId) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        // Subscribe to real-time account balance updates
        const channel = supabaseHelpers.subscribeToAccounts(userId, (payload) => {
            console.log('Account balance update:', payload);
            
            // Update local state
            if (payload.eventType === 'UPDATE') {
                setAccounts(prev => 
                    prev.map(acc => acc.id === payload.new.id ? payload.new : acc)
                );
                
                // Refresh dashboard data
                router.reload({ only: ['accounts', 'totalBalance'] });
            }
        });

        // Cleanup subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { accounts, loading };
};

export const useSupabaseStorage = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (bucket, filePath, file) => {
        setUploading(true);
        try {
            const result = await supabaseHelpers.uploadReceipt(filePath, file);
            return result;
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const getPublicUrl = (bucket, filePath) => {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        return data.publicUrl;
    };

    return {
        uploadFile,
        getPublicUrl,
        uploading,
    };
};

export const useSupabaseAnalytics = (userId) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAnalytics = async (startDate, endDate) => {
        setLoading(true);
        try {
            const data = await supabaseHelpers.getTransactionAnalytics(
                userId, 
                startDate, 
                endDate
            );
            setAnalytics(data);
            return data;
        } catch (error) {
            console.error('Analytics fetch failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        analytics,
        fetchAnalytics,
        loading,
    };
};

export default useSupabase;






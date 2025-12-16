import { useState, useEffect, useCallback } from 'react';
import { riderApi } from '../services/riderApi';

export const useRiderOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await riderApi.getAssignedOrders();
            setOrders(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refreshOrders: fetchOrders };
};

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Order, OrderItem } from '../types/orders'

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [orderDetails, setOrderDetails] = useState<Record<string, OrderItem[]>>({})

    const fetchOrders = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        setOrders(data || [])
        setLoading(false)
    }

    const fetchOrderItems = async (orderId: string): Promise<OrderItem[] | null> => {
        if (orderDetails[orderId]) {
            return orderDetails[orderId]
        }

        const { data, error } = await supabase
            .from('order_items')
            .select('item_name, quantity, item_total')
            .eq('order_id', orderId)

        if (!error && data) {
            setOrderDetails(prev => ({ ...prev, [orderId]: data }))
            return data
        }
        return null
    }

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            alert('Error updating status: ' + error.message)
            return false
        }
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
        return true
    }

    useEffect(() => {
        fetchOrders()

        const channel = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { orders, loading, orderDetails, fetchOrderItems, updateStatus }
}

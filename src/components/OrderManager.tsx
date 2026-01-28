import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Order {
  id: string;
  user_name: string;
  user_surname: string;
  status: string;
  total: number;
  created_at: string;
  items: any[]; 
}

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Set up real-time subscription
    const channel = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
        alert('Error updating order: ' + error.message);
    } else {
        // Optimistic update
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const otherOrders = orders.filter(o => o.status !== 'pending');

  return (
    <div className="space-y-6 h-full flex flex-col">
       {/* Pending Orders Section */}
       <div className="flex-1 overflow-auto custom-scrollbar space-y-4">
        <h2 className="text-xl font-bold text-white mb-4 sticky top-0 bg-[#1F1D2B] py-2 z-10 flex items-center justify-between">
            <span>Pending Orders</span>
            <span className="text-[#EA7C69] text-sm font-normal cursor-pointer hover:underline">View All</span>
        </h2>
        
        {loading ? (
             <div className="text-center py-6 text-gray-500">Loading orders...</div>
        ) : pendingOrders.length === 0 ? (
             <div className="text-center py-10 text-gray-500 bg-[#2D303E] rounded-xl border border-dashed border-[#393C49]">
                No pending orders right now.
             </div>
        ) : (
            <div className="space-y-4">
                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-[#2D303E] rounded-xl p-4 border border-transparent hover:border-[#EA7C69]/30 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#393C49] flex items-center justify-center text-white font-bold">
                                    {order.user_name?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{order.user_name} {order.user_surname}</h3>
                                    <p className="text-xs text-gray-400">#{order.id.slice(0, 5)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-lg text-white">R{order.total.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={() => updateStatus(order.id, 'cancelled')}
                                className="flex-1 py-2 px-3 border border-[#EA7C69] text-[#EA7C69] rounded-lg hover:bg-[#EA7C69]/10 text-sm font-semibold transition-colors"
                            >
                                Decline
                            </button>
                            <button 
                                onClick={() => updateStatus(order.id, 'approved')}
                                className="flex-1 py-2 px-3 bg-[#EA7C69] text-white rounded-lg hover:bg-[#e66551] text-sm font-semibold shadow-md shadow-[#EA7C69]/20 transition-colors"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

       {/* Order History (Simplified) */}
       <div className="bg-[#2D303E] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent History</h2>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-[#393C49]">
                    <tr>
                        <th className="pb-2 font-medium">Customer</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#393C49]">
                    {otherOrders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                            <td className="py-3 font-medium text-gray-300">{order.user_name}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    order.status === 'approved' ? 'bg-[#1e3435] text-[#50d1aa]' : 
                                    order.status === 'cancelled' ? 'bg-[#3b2326] text-[#e85b6a]' :
                                    'bg-[#393C49] text-gray-300'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="py-3 text-right text-white">R{order.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    {otherOrders.length === 0 && (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">No history available</td></tr>
                    )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

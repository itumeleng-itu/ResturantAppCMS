import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  item_name: string;
  quantity: number;
  item_total: number;
}

interface Order {
  id: string;
  user_name: string;
  user_surname: string;
  status: string;
  total: number;
  created_at: string;
  delivery_street: string;
  delivery_city: string;
  user_contact: string;
  order_items?: OrderItem[]; // We will fetch these separately or via join
}

const ALL_STATUSES = ['pending', 'approved', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    fetchOrders();
    
    // Real-time updates
    const channel = supabase
      .channel('public:orders')
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

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    if (orderDetails[orderId]) {
      setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
      return;
    }

    const { data, error } = await supabase
      .from('order_items')
      .select('item_name, quantity, item_total')
      .eq('order_id', orderId);

    if (!error && data) {
      setOrderDetails(prev => ({ ...prev, [orderId]: data }));
    }
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      // The real-time subscription will update the list, but we can optimistically update too
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'returned': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8 text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ← Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    filterStatus === 'all' 
                    ? 'bg-gray-800 text-white border-gray-800' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
                }`}
            >
                All Orders ({orders.length})
            </button>
            {ALL_STATUSES.map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border capitalize ${
                        filterStatus === status 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
                    }`}
                >
                    {status.replace(/_/g, ' ')} ({orders.filter(o => o.status === status).length})
                </button>
            ))}
        </div>

        {/* Orders List */}
        {loading ? (
             <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : (
             <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400">No orders found with this status.</p>
                    </div>
                ) : filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Order Summary Header */}
                        <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        {order.user_name} {order.user_surname}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>Order #{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleString()}</p>
                                    <p>📍 {order.delivery_street}, {order.delivery_city}</p>
                                    <p>📞 {order.user_contact}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end justify-between gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">R{order.total.toFixed(2)}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => fetchOrderItems(order.id)}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        {expandedOrderId === order.id ? 'Hide Items' : 'View Items'}
                                    </button>
                                    
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium"
                                    >
                                        {ALL_STATUSES.map(s => (
                                            <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Order Details (Collapsible) */}
                        {expandedOrderId === order.id && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Order Items</h4>
                                {orderDetails[order.id] ? (
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-200">
                                            <tr>
                                                <th className="pb-2">Item</th>
                                                <th className="pb-2 text-center">Qty</th>
                                                <th className="pb-2 text-right">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails[order.id].map((item, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                    <td className="py-2 text-gray-800 font-medium">{item.item_name}</td>
                                                    <td className="py-2 text-center text-gray-500">x{item.quantity}</td>
                                                    <td className="py-2 text-right text-gray-600">R{item.item_total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-4 text-gray-400">Loading items...</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
             </div>
        )}
      </div>
    </div>
  );
}

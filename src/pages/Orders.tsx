import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/orders'
import { ALL_STATUSES } from '../types/orders'

export default function OrderManagement() {
  const navigate = useNavigate()
  const { orders, loading, orderDetails, fetchOrderItems, updateStatus } = useOrders()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const handleToggleExpand = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      await fetchOrderItems(orderId)
      setExpandedOrderId(orderId)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8 text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <span className="material-icons">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          </div>
        </div>

        <StatusFilters
          orders={orders}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">No orders found with this status.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  orderItems={orderDetails[order.id]}
                  onToggleExpand={() => handleToggleExpand(order.id)}
                  onStatusChange={(status) => updateStatus(order.id, status)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface StatusFiltersProps {
  orders: { status: string }[]
  filterStatus: string
  onFilterChange: (status: string) => void
}

function StatusFilters({ orders, filterStatus, onFilterChange }: StatusFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <button
        onClick={() => onFilterChange('all')}
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
          onClick={() => onFilterChange(status)}
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
  )
}

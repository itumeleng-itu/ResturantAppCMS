import type { Order, OrderItem } from '../../types/orders'
import { getStatusColor, ALL_STATUSES } from '../../types/orders'

interface OrderCardProps {
  order: Order
  isExpanded: boolean
  orderItems?: OrderItem[]
  onToggleExpand: () => void
  onStatusChange: (status: string) => void
}

export function OrderCard({ order, isExpanded, orderItems, onToggleExpand, onStatusChange }: OrderCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
            <p>Order #{order.id.slice(0, 8)} - {new Date(order.created_at).toLocaleString()}</p>
            <p><span className="material-icons text-sm align-middle mr-1">location_on</span>{order.delivery_street}, {order.delivery_city}</p>
            <p><span className="material-icons text-sm align-middle mr-1">phone</span>{order.user_contact}</p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">R{order.total.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleExpand}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              {isExpanded ? 'Hide Items' : 'View Items'}
            </button>

            <div className="text-sm text-gray-500 font-medium px-3 py-2">
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase">Order Items</h4>
          {orderItems ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-200">
                <tr>
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
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
  )
}

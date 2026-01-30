//import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { getStatusColor } from '../types/orders'

export default function OrderManagement() {
  const navigate = useNavigate()
  const { orders, loading } = useOrders()

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="material-icons text-gray-600">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">#{order.id.slice(0, 6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {order.user_name?.[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{order.user_name} {order.user_surname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.delivery_city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('en-ZA')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.delivery_street || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.user_contact}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">R{order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <span className="material-icons text-xl">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

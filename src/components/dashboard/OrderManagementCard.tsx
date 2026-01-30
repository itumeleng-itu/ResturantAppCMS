import { useNavigate } from 'react-router-dom'

export function OrderManagementCard() {
  const navigate = useNavigate()

  return (
    <section className='cursor-pointer' onClick={() => navigate('/orders')}>
      <div className='flex items-center gap-2 mb-2'>
        <h2 className='font-bold text-gray-700'>Orders</h2>
      </div>
      <div className='flex h-24 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow cursor-pointer group'>
        <div className="flex items-center gap-4 px-6 w-full">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <span className="material-icons">receipt_long</span>
          </div>
          <div>
            <h2 className="text-md font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
              View Orders
            </h2>
            <p className="text-xs text-gray-400">Track and monitor all orders</p>
          </div>
        </div>
      </div>
    </section>
  )
}

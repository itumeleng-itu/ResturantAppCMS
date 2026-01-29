import { useNavigate } from 'react-router-dom'
import '../index.css'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  RevenueCard,
  OrderManagementCard,
  InventoryCard,
  FavouritesChart,
  StatsCard
} from '../components/dashboard'

function Dashboard() {
  const navigate = useNavigate()
  const { revenue, topItems, categories, uniqueMenuItemsCount, isLoading } = useDashboardData()

  return (
    <div className='min-h-screen bg-[#f3f4f6] p-8 text-gray-600 font-sans'>
      <header className='mb-6 flex justify-between items-start'>
        <div>
          <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>Dashboard</p>
          <h1 className='text-2xl font-bold text-gray-700 mt-1'>Order Management</h1>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <span className="material-icons text-gray-600">account_circle</span>
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </button>
      </header>
      <hr className='mb-6 border-gray-200' />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-5 flex flex-col gap-6'>
          <RevenueCard revenue={revenue} isLoading={isLoading} />
          <OrderManagementCard />
          <InventoryCard categories={categories} isLoading={isLoading} />
        </div>

        <div className='lg:col-span-7 flex flex-col gap-6'>
          <FavouritesChart topItems={topItems} isLoading={isLoading} />
          <StatsCard uniqueMenuItemsCount={uniqueMenuItemsCount} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
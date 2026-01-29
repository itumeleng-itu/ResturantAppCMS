import { useNavigate } from 'react-router-dom'
import { getCategoryIcon } from '../../utils/categoryIcons'
import type { Category } from '../../hooks/useDashboardData'

interface InventoryCardProps {
  categories: Category[]
  isLoading: boolean
}

export function InventoryCard({ categories, isLoading }: InventoryCardProps) {
  const navigate = useNavigate()

  return (
    <section className='flex-grow group'>
      <div className='flex items-center gap-2 mb-2'>
        <h2 className='font-bold text-gray-700'>Inventory</h2>
      </div>
      <div className='h-64 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden p-5 flex flex-col'>
        <div className="flex-grow">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center cursor-pointer" onClick={() => navigate('/inventory')}>
                <span className="material-icons text-5xl text-gray-300 mb-2 block">inventory_2</span>
                <span className="text-gray-400 text-sm">No categories yet</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 h-full">
              {categories.slice(0, 6).map((category) => (
                <div 
                  key={category.id}
                  onClick={() => navigate('/inventory')}
                  className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl cursor-pointer hover:from-blue-50 hover:to-indigo-100 hover:shadow-md transition-all group/item"
                >
                  <span className="material-icons text-2xl text-gray-500 group-hover/item:text-indigo-600 transition-colors mb-1">
                    {getCategoryIcon(category.name)}
                  </span>
                  <span className="text-xs font-medium text-gray-600 group-hover/item:text-indigo-700 truncate w-full text-center">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/inventory'); }}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <span className="material-icons text-sm">settings</span>
            Manage Categories
          </button>
        </div>
      </div>
    </section>
  )
}

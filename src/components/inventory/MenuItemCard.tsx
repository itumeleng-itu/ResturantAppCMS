import type { MenuItem } from '../../types/inventory'
import { getCategoryIcon } from '../../utils/categoryIcons'

interface MenuItemCardProps {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
          item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {item.is_available ? 'Active' : 'Sold Out'}
        </span>
      </div>

      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="material-icons text-2xl text-gray-500">{getCategoryIcon(item.name)}</span>
      </div>

      <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[40px]">
        {item.description || 'No description provided.'}
      </p>

      <div className="flex items-end justify-between mt-4">
        <span className="text-xl font-bold text-gray-900">R{item.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

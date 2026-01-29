import type { MenuItem, Category } from '../../types/inventory'

interface ItemFormModalProps {
  item: Partial<MenuItem>
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<MenuItem>) => void
  onChange: (item: Partial<MenuItem>) => void
}

export function ItemFormModal({ item, categories, isOpen, onClose, onSave, onChange }: ItemFormModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(item)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{item.id ? 'Edit Item' : 'New Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
            <input
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={item.name || ''}
              onChange={e => onChange({ ...item, name: e.target.value })}
              placeholder="e.g. Double Cheese Burger"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (R)</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={item.price || ''}
                onChange={e => onChange({ ...item, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={item.category_id || ''}
                onChange={e => onChange({ ...item, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              rows={3}
              value={item.description || ''}
              onChange={e => onChange({ ...item, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={item.image_url || ''}
              onChange={e => onChange({ ...item, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {item.image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={item.image_url} 
                  alt="Preview" 
                  className="w-full h-24 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_avail"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={item.is_available ?? true}
              onChange={e => onChange({ ...item, is_available: e.target.checked })}
            />
            <label htmlFor="is_avail" className="text-sm font-semibold text-gray-700">Available for ordering</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
          >
            {item.id ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../hooks/useInventory'
import { MenuItemCard, ItemFormModal } from '../components/inventory'
import type { MenuItem, Category } from '../types/inventory'

export default function Inventory() {
  const navigate = useNavigate()
  const { items, categories, loading, deleteItem, saveItem } = useInventory()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({})

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category_id === selectedCategory)

  const handleSave = async (item: Partial<MenuItem>) => {
    const success = await saveItem(item)
    if (success) {
      setIsEditing(false)
      setCurrentItem({})
    }
  }

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item)
    setIsEditing(true)
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8 text-gray-700 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <span className="material-icons">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          </div>
          <button
            onClick={() => { setIsEditing(true); setCurrentItem({}); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
          >
            + Add New Item
          </button>
        </div>

        <CategoryTabs 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading inventory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={deleteItem} />
            ))}
            <AddNewCard onClick={() => { setIsEditing(true); setCurrentItem({}); }} />
          </div>
        )}

        <ItemFormModal
          item={currentItem}
          categories={categories}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onChange={setCurrentItem}
        />
      </div>
    </div>
  )
}

function CategoryTabs({ categories, selectedCategory, onSelect }: { 
  categories: Category[], 
  selectedCategory: string, 
  onSelect: (id: string) => void 
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <button
        onClick={() => onSelect('all')}
        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
          selectedCategory === 'all'
            ? 'bg-gray-800 text-white shadow-md'
            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        All Items
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
            selectedCategory === cat.id
              ? 'bg-gray-800 text-white shadow-md'
              : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

function AddNewCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[200px]"
    >
      <span className="material-icons text-4xl mb-2">add</span>
      <span className="font-semibold">Add New Item</span>
    </button>
  )
}

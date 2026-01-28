import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_available: boolean;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Edit/Create State
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [ { data: itemsData }, { data: catData } ] = await Promise.all([
      supabase.from('menu_items').select('*').order('name'),
      supabase.from('categories').select('*').order('name')
    ]);

    if (itemsData) setItems(itemsData);
    if (catData) setCategories(catData);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) alert('Error deleting item');
    else fetchData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
        name: currentItem.name,
        description: currentItem.description,
        price: currentItem.price,
        category_id: currentItem.category_id,
        is_available: currentItem.is_available ?? true
    };

    if (currentItem.id) {
      const { error } = await supabase.from('menu_items').update(itemData).eq('id', currentItem.id);
      if (error) alert('Error updating item: ' + error.message);
    } else {
      const { error } = await supabase.from('menu_items').insert([itemData]);
      if (error) alert('Error adding item: ' + error.message);
    }
    setIsEditing(false);
    setCurrentItem({});
    fetchData();
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

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
                <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
            </div>
            <button
              onClick={() => { setIsEditing(true); setCurrentItem({}); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
            >
              + Add New Item
            </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <button
                onClick={() => setSelectedCategory('all')}
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
                    onClick={() => setSelectedCategory(cat.id)}
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

        {/* Grid */}
        {loading ? (
            <div className="text-center py-20 text-gray-400">Loading inventory...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                                item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {item.is_available ? 'Active' : 'Sold Out'}
                            </span>
                        </div>

                        {/* Icon Placeholder */}
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">
                            🍽️
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[40px]">{item.description || 'No description provided.'}</p>
                        
                        <div className="flex items-end justify-between mt-4">
                            <span className="text-xl font-bold text-gray-900">R{item.price.toFixed(2)}</span>
                            <div className="flex gap-2">
                                <button 
                                   onClick={() => { setCurrentItem(item); setIsEditing(true); }}
                                   className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                   Edit
                                </button>
                                <button 
                                   onClick={() => handleDelete(item.id)}
                                   className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                   Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add New Card */}
                <button
                   onClick={() => { setIsEditing(true); setCurrentItem({}); }}
                   className="border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[200px]"
                >
                    <span className="text-4xl mb-2">+</span>
                    <span className="font-semibold">Add New Item</span>
                </button>
            </div>
        )}

        {/* Modal */}
        {isEditing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">{currentItem.id ? 'Edit Item' : 'New Item'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                            <input
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={currentItem.name || ''}
                                onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
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
                                    value={currentItem.price || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })}
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={currentItem.category_id || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, category_id: e.target.value })}
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
                                value={currentItem.description || ''}
                                onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                             <input 
                                type="checkbox" 
                                id="is_avail"
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={currentItem.is_available ?? true}
                                onChange={e => setCurrentItem({...currentItem, is_available: e.target.checked})}
                             />
                             <label htmlFor="is_avail" className="text-sm font-semibold text-gray-700">Available for ordering</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4"
                        >
                            {currentItem.id ? 'Save Changes' : 'Create Item'}
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

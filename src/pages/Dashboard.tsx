import { useEffect, useState } from 'react' // 1. Added useState
import { useNavigate } from 'react-router-dom'
import '../index.css'
import { supabase } from '../lib/supabaseClient'

function App() {
  const navigate = useNavigate();
  // 2. Initialize state for revenue
  const [revenue, setRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topItems, setTopItems] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // 1. Fetch Revenue (All valid sales)
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("total")
        .neq("status", 'cancelled')
        .neq("status", 'refunded');

      if (orderError) {
        console.error("Supabase Error (Orders):", orderError);
      } else if (orders) {
        const totalSum = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        setRevenue(totalSum);
      }

      // 2. Fetch Top Items
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("item_name, quantity");

      if (itemsError) {
        console.error("Supabase Error (Items):", itemsError);
      } else if (items) {
        // Aggregate items
        const itemCounts: Record<string, number> = {};
        items.forEach(item => {
            const name = item.item_name;
            const  qty = item.quantity || 1;
            itemCounts[name] = (itemCounts[name] || 0) + qty;
        });

        // Convert to array and sort
        const sortedItems = Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        setTopItems(sortedItems);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Helper for max value in graph
  const maxCount = Math.max(...topItems.map(i => i.count), 1);

  return (
    <div className='min-h-screen bg-[#f3f4f6] p-8 text-gray-600 font-sans'>
      <header className='mb-6'>
        <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>Dashboard</p>
        <h1 className='text-2xl font-bold text-gray-700 mt-1'>Order Management</h1>
        <hr className='mt-4 border-gray-200' />
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-5 flex flex-col gap-6'>
          
          {/* Revenue Section */}
          <section>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Revenue</h2>
            </div>
            <div className='flex h-24 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow'>
              <div className="flex items-center gap-4 px-6 w-full">
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400 font-medium uppercase">Total Revenue</p>
                      <h2 className={`text-3xl font-bold ${isLoading ? 'text-gray-300 animate-pulse' : 'text-gray-800'}`}>
                        {isLoading ? '...' : `R${revenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                      </h2>
                  </div>
              </div>
            </div>
          </section>

          <section className='cursor-pointer' onClick={() => navigate('/orders')}>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Order Management</h2>
            </div>
            <div className='flex h-24 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow cursor-pointer group'>
              <div className="flex items-center gap-4 px-6 w-full">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  </div>
                  <div>
                      <h2 className="text-md font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                        Manage Orders
                      </h2>
                      <p className="text-xs text-gray-400">Review and approve incoming orders</p>
                  </div>
              </div>
            </div>
          </section>

          <section className='flex-grow cursor-pointer group' onClick={() => navigate('/inventory')}>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700 group-hover:text-blue-600 transition-colors'>Inventory</h2>
            </div>
            <div className='h-64 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden'>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-9xl">🍱</span>
                </div>
                <div className="text-center z-10">
                    <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">🍱</span>
                    <span className="text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Click to Manage Inventory</span>
                </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className='lg:col-span-7 flex flex-col gap-6'>
          <section className='flex-grow'>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>User Favourites</h2>
            </div>
            <div className='h-[350px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">Loading charts...</div>
                ) : topItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">No order data yet.</div>
                ) : (
                    <div className="h-full flex flex-col justify-center space-y-5">
                        {topItems.map((item, index) => (
                            <div key={index} className="w-full">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-semibold text-gray-700 truncate w-32">{item.name}</span>
                                    <span className="text-xs font-bold text-gray-400">{item.count} orders</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'][index % 5]}`}
                                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </section>

          <section>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Application Stats</h2>
            </div>
            <div className='h-44 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-around'>
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">{topItems.length > 0 ? topItems.reduce((a,b) => a + b.count, 0) : 0}</p>
                    <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Total Items Sold</p>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">4.8</p>
                    <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Avg Rating</p>
                </div>
                 <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">12min</p>
                    <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Avg Prep Time</p>
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
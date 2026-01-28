import { useEffect, useState } from 'react' // 1. Added useState
import '../index.css'
import { supabase } from '../lib/supabaseClient'

function App() {
  // 2. Initialize state for revenue
  const [revenue, setRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("total")
        .eq("status", 'pending'); // Changed to 'approved' based on your previous goal

      if (error) {
        console.error("Supabase Error:", error);
      } else if (data) {
        const totalSum = data.reduce((sum, order) => sum + (order.total || 0), 0);
        setRevenue(totalSum); // 3. Set the state
      }
      setIsLoading(false);
    };

    fetchRevenue();
  }, []);

  
  

  return (
    <div className='min-h-screen bg-[#f3f4f6] p-8 text-gray-600'>
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
            <div className='flex h-24 bg-gray-200/60 rounded-2xl border border-gray-100 shadow-sm items-center'>
              <h2 className={`ml-5 text-4xl font-bold ${isLoading ? 'text-gray-300 animate-pulse' : 'text-green-500'}`}>
                {/* 4. Display formatted currency */}
                {isLoading ? 'Loading...' : `R${revenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
              </h2>
            </div>
          </section>

          {/* ... rest of your code ... */}
          <section>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Order Management</h2>
            </div>
            <div className='flex h-24 bg-gray-200/60 rounded-2xl border border-gray-100 shadow-sm items-center'>
              <h2 className="ml-5 text-md font-bold text-gray-400">
                Manage orders (Review, decline or approve orders)
              </h2>
            </div>
          </section>

          <section className='flex-grow'>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Inventory</h2>
            </div>
            <div className='h-64 bg-gray-200/60 rounded-2xl border border-gray-100 shadow-sm'></div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className='lg:col-span-7 flex flex-col gap-6'>
          <section className='flex-grow'>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>User Favourites</h2>
            </div>
            <div className='h-[310px] bg-gray-200/60 rounded-2xl border border-gray-100 shadow-sm'></div>
          </section>

          <section>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='font-bold text-gray-700'>Application Stats</h2>
            </div>
            <div className='h-44 bg-gray-200/60 rounded-2xl border border-gray-100 shadow-sm'></div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
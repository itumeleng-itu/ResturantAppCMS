interface StatsCardProps {
  uniqueMenuItemsCount: number
}

export function StatsCard({ uniqueMenuItemsCount }: StatsCardProps) {
  return (
    <section>
      <div className='flex items-center gap-2 mb-2'>
        <span className="material-icons text-gray-500 text-lg">analytics</span>
        <h2 className='font-bold text-gray-700'>Application Stats</h2>
      </div>
      <div className='h-44 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-around'>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-orange-500 mr-2">restaurant_menu</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{uniqueMenuItemsCount}</p>
          <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Menu Items</p>
        </div>
        <div className="h-10 w-px bg-gray-200"></div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-yellow-500 mr-2">star</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">4.8</p>
          <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Avg Rating</p>
        </div>
        <div className="h-10 w-px bg-gray-200"></div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="material-icons text-green-500 mr-2">schedule</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">12min</p>
          <p className="text-xs text-gray-400 uppercase font-semibold mt-1">Avg Prep Time</p>
        </div>
      </div>
    </section>
  )
}

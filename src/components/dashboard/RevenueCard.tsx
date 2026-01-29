interface RevenueCardProps {
  revenue: number
  isLoading: boolean
}

export function RevenueCard({ revenue, isLoading }: RevenueCardProps) {
  return (
    <section>
      <div className='flex items-center gap-2 mb-2'>
        <h2 className='font-bold text-gray-700'>Revenue</h2>
      </div>
      <div className='flex h-24 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm items-center hover:shadow-md transition-shadow'>
        <div className="flex items-center gap-4 px-6 w-full">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <span className="material-icons">payments</span>
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
  )
}

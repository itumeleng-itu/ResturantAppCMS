import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { createChartData, chartOptions } from '../../utils/chartConfig'
import type { TopItem } from '../../hooks/useDashboardData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface FavouritesChartProps {
  topItems: TopItem[]
  isLoading: boolean
}

export function FavouritesChart({ topItems, isLoading }: FavouritesChartProps) {
  const chartData = createChartData(topItems)

  return (
    <section className='flex-grow'>
      <div className='flex items-center gap-2 mb-2'>
        <span className="material-icons text-gray-500 text-lg">favorite</span>
        <h2 className='font-bold text-gray-700'>User Favourites</h2>
        <span className="text-xs text-gray-400 ml-auto">Top 5 Items</span>
      </div>
      <div className='h-[350px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <span className="material-icons text-4xl animate-pulse mb-2 block">show_chart</span>
              <span>Loading chart...</span>
            </div>
          </div>
        ) : topItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <span className="material-icons text-4xl mb-2 block">trending_up</span>
              <span>No order data yet.</span>
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </section>
  )
}

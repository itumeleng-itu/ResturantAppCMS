import type { TooltipItem } from 'chart.js'
import type { TopItem } from '../hooks/useDashboardData'

export function createChartData(topItems: TopItem[]) {
    return {
        labels: topItems.map(item =>
            item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name
        ),
        datasets: [
            {
                label: 'Orders',
                data: topItems.map(item => item.count),
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
            },
        ],
    }
}

export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
                label: function (context: TooltipItem<'line'>) {
                    return `${context.parsed.y ?? 0} orders`
                }
            }
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF', font: { size: 11 } },
        },
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(229, 231, 235, 0.5)' },
            ticks: { color: '#9CA3AF', font: { size: 11 }, stepSize: 1 },
        },
    },
    interaction: { intersect: false, mode: 'index' as const },
}

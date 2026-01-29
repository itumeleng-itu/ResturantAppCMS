import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Category {
    id: string
    name: string
}

interface TopItem {
    name: string
    count: number
}

interface DashboardData {
    revenue: number
    topItems: TopItem[]
    categories: Category[]
    uniqueMenuItemsCount: number
    isLoading: boolean
}

export function useDashboardData(): DashboardData {
    const [revenue, setRevenue] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [topItems, setTopItems] = useState<TopItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [uniqueMenuItemsCount, setUniqueMenuItemsCount] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)

            const { data: orders } = await supabase
                .from('orders')
                .select('total')
                .neq('status', 'cancelled')
                .neq('status', 'refunded')

            if (orders) {
                const totalSum = orders.reduce((sum, order) => sum + (order.total || 0), 0)
                setRevenue(totalSum)
            }

            // 2. Fetch Top Items (Top 3) - directly from order_items
            const { data: allOrderItems, error: itemsError } = await supabase
                .from('order_items')
                .select('item_name, quantity')

            console.log('All Order Items:', allOrderItems, 'Error:', itemsError)

            if (allOrderItems && allOrderItems.length > 0) {
                const itemCounts: Record<string, number> = {}
                allOrderItems.forEach((item: any) => {
                    const name = item.item_name
                    const qty = item.quantity || 1
                    itemCounts[name] = (itemCounts[name] || 0) + qty
                })

                const sortedItems = Object.entries(itemCounts)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)

                console.log('Final Sorted Top Items:', sortedItems)
                setTopItems(sortedItems)
            } else {
                console.log('No order items found in database')
                setTopItems([])
            }

            const { data: catData } = await supabase
                .from('categories')
                .select('*')
                .limit(6)

            if (catData) {
                setCategories(catData)
            }

            const { count: menuItemsCount } = await supabase
                .from('menu_items')
                .select('*', { count: 'exact', head: true })

            if (menuItemsCount !== null) {
                setUniqueMenuItemsCount(menuItemsCount)
            }

            setIsLoading(false)
        }

        fetchData()
    }, [])

    return { revenue, topItems, categories, uniqueMenuItemsCount, isLoading }
}

export type { Category, TopItem, DashboardData }

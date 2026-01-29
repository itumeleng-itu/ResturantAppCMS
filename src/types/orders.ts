export interface OrderItem {
    item_name: string
    quantity: number
    item_total: number
}

export interface Order {
    id: string
    user_name: string
    user_surname: string
    status: string
    total: number
    created_at: string
    delivery_street: string
    delivery_city: string
    user_contact: string
    order_items?: OrderItem[]
}

export const ALL_STATUSES = ['pending', 'approved', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'returned']

export function getStatusColor(status: string): string {
    switch (status) {
        case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'preparing': return 'bg-purple-100 text-purple-700 border-purple-200'
        case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
        case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
        case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
        case 'returned': return 'bg-gray-100 text-gray-700 border-gray-200'
        default: return 'bg-gray-100 text-gray-600'
    }
}

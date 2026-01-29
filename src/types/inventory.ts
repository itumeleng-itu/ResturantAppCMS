export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category_id: string
    is_available: boolean
    image_url?: string
}

export interface Category {
    id: string
    name: string
}

// Map category names to Material Icons
export const categoryIconMap: Record<string, string> = {
    'Burgers': 'lunch_dining',
    'Pizza': 'local_pizza',
    'Drinks': 'local_bar',
    'Beverages': 'local_cafe',
    'Desserts': 'cake',
    'Salads': 'eco',
    'Sides': 'fastfood',
    'Breakfast': 'free_breakfast',
    'Seafood': 'set_meal',
    'Chicken': 'restaurant',
    'Pasta': 'ramen_dining',
    'Starters': 'tapas',
    'Mains': 'dinner_dining',
    'Specials': 'star',
    'default': 'restaurant_menu'
}

export function getCategoryIcon(categoryName: string): string {
    const normalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()
    return categoryIconMap[normalizedName] || categoryIconMap['default']
}

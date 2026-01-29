import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { MenuItem, Category } from '../types/inventory'

export function useInventory() {
    const [items, setItems] = useState<MenuItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        const [{ data: itemsData }, { data: catData }] = await Promise.all([
            supabase.from('menu_items').select('*').order('name'),
            supabase.from('categories').select('*').order('name')
        ])

        if (itemsData) setItems(itemsData)
        if (catData) setCategories(catData)
        setLoading(false)
    }

    const deleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return false
        const { error } = await supabase.from('menu_items').delete().eq('id', id)
        if (error) {
            alert('Error deleting item')
            return false
        }
        await fetchData()
        return true
    }

    const saveItem = async (item: Partial<MenuItem>) => {
        const itemData = {
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            is_available: item.is_available ?? true,
            image_url: item.image_url || null
        }

        if (item.id) {
            const { error } = await supabase.from('menu_items').update(itemData).eq('id', item.id)
            if (error) {
                alert('Error updating item: ' + error.message)
                return false
            }
        } else {
            const { error } = await supabase.from('menu_items').insert([itemData])
            if (error) {
                alert('Error adding item: ' + error.message)
                return false
            }
        }
        await fetchData()
        return true
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { items, categories, loading, deleteItem, saveItem, refetch: fetchData }
}

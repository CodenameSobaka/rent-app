// app/search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import Header from '@/components/Header'
import SearchFilters from '@/components/SearchFilters'
import ListingCard from '@/components/ListingCard'

export default function SearchPage() {
  const supabase = createClientBrowser()
  
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Основной поиск
  const fetchListings = async (filters: any = {}) => {
    setLoading(true)
    setShowSuggestions(false)

    let query = supabase.from('listings').select('*')

    if (filters.query || searchQuery) {
      const q = filters.query || searchQuery
      query = query.or(`title.ilike.%${q}%,address.ilike.%${q}%`)
    }
    if (filters.minPrice) query = query.gte('price', Number(filters.minPrice))
    if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice))
    if (filters.rooms) query = query.eq('rooms', Number(filters.rooms))

    if (filters.sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) console.error(error)
    else setListings(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [])

  // Автодополнение
  const handleSearchInput = async (value: string) => {
    setSearchQuery(value)

    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const { data } = await supabase
      .from('listings')
      .select('id, title, address')
      .or(`title.ilike.%${value}%,address.ilike.%${value}%`)
      .limit(6)

    setSuggestions(data || [])
    setShowSuggestions(true)
  }

  const selectSuggestion = (item: any) => {
    setSearchQuery(item.title || item.address)
    setShowSuggestions(false)
    fetchListings({ query: item.title || item.address })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Улучшенная строка поиска с кнопкой */}
        <div className="relative mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Поиск по району, метро или названию..."
                className="w-full p-4 pl-12 border border-gray-300 rounded-3xl text-lg focus:outline-none focus:border-blue-500"
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              />
              <span className="absolute left-5 top-4 text-gray-400 text-xl">🔍</span>
            </div>

            <button
              onClick={() => fetchListings({ query: searchQuery })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-3xl font-medium transition"
            >
              Найти
            </button>
          </div>

          {/* Выпадающий список подсказок */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 max-h-80 overflow-auto z-50">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectSuggestion(item)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-none"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <SearchFilters onSearch={fetchListings} />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 mt-4">Найдено {listings.length} объявлений</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onDelete={(id) => setListings(prev => prev.filter(l => l.id !== id))}
                />
              ))}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">🏠</p>
                <p className="text-xl">Объявлений не найдено</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
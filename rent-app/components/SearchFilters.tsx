// components/SearchFilters.tsx
'use client'

import { useState } from 'react'

export default function SearchFilters({ onSearch }: { onSearch?: (params: any) => void }) {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rooms: '',
    sort: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    if (onSearch) onSearch(filters)
  }

  const resetFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', rooms: '', sort: '' })
    if (onSearch) onSearch({})
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border">
      <div className="flex flex-wrap gap-4 items-end">
        <select 
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="p-4 border border-gray-300 rounded-2xl"
        >
          <option value="">Сортировка</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="newest">Сначала новые</option>
        </select>

        <select 
          value={filters.rooms}
          onChange={(e) => handleFilterChange('rooms', e.target.value)}
          className="p-4 border border-gray-300 rounded-2xl"
        >
          <option value="">Комнаты</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <div className="flex gap-3">
          <input 
            type="number" 
            placeholder="Цена от" 
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-32 p-4 border border-gray-300 rounded-2xl"
          />
          <input 
            type="number" 
            placeholder="Цена до" 
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-32 p-4 border border-gray-300 rounded-2xl"
          />
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-blue-700"
        >
          Применить
        </button>

        <button
          onClick={resetFilters}
          className="text-gray-500 hover:text-gray-700 px-5 py-4 font-medium"
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}
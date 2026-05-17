'use client'

import { createClientBrowser } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ListingCard({ 
  listing, 
  onDelete 
}: { 
  listing: any 
  onDelete?: (id: string) => void 
}) {
  const router = useRouter()
  const supabase = createClientBrowser()
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.id === listing.user_id) setIsOwner(true)
    })
  }, [listing.user_id])

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Удалить это объявление?')) return

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id)

    if (error) {
      alert('Ошибка удаления: ' + error.message)
    } else {
      if (onDelete) onDelete(listing.id)   // ← Обновляем список сразу
      else router.refresh()
    }
  }

  return (
    <div 
      onClick={() => router.push(`/listing/${listing.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative cursor-pointer"
    >
      <div className="h-56 bg-gray-200 relative">
        {listing.images ? (
          <img 
            src={listing.images} 
            alt={listing.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🏠</div>
        )}

        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl font-bold text-xl shadow">
          {listing.price?.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{listing.address}</p>
        {listing.rooms && <p className="font-medium text-sm">{listing.rooms}-комнатная</p>}
      </div>

      {isOwner && (
        <button
          onClick={handleDelete}
          className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition z-10"
        >
          Удалить
        </button>
      )}
    </div>
  )
}
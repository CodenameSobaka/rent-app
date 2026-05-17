// app/add/page.tsx
'use client'

import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import YandexMap from '@/components/YandexMap'

export default function AddListingPage() {
  const router = useRouter()
  const supabase = createClientBrowser()

  const [loading, setLoading] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const [form, setForm] = useState({
    title: '',
    price: '',
    rooms: '',
    area: '',
    floor: '',
    address: '',
    description: '',
    image: ''
  })

  // Исправленный handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    alert("Вы не авторизованы")
    router.push('/login')
    return
  }

  const { error } = await supabase.from('listings').insert({
    title: form.title.trim(),
    price: parseInt(form.price) || 0,
    rooms: form.rooms ? parseInt(form.rooms) : null,
    area: form.area ? parseInt(form.area) : null,
    floor: form.floor ? parseInt(form.floor) : null,
    address: form.address.trim(),
    description: form.description.trim(),
    images: form.image || null,
    latitude: coordinates?.lat || null,
    longitude: coordinates?.lng || null,
    user_id: session.user.id,           // ← важно
    source: 'manual'
  })

  if (error) {
    console.error(error)
    alert('Ошибка: ' + error.message)
  } else {
    alert('✅ Объявление успешно опубликовано!')
    router.push('/search')
  }

  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <a 
  href="/search" 
  className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 text-lg font-medium"
>
  ← Назад к поиску
</a>
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h1 className="text-3xl font-bold mb-8">Новое объявление об аренде</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Поля формы (оставляем как было) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Заголовок объявления *</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange}
                  className="w-full p-4 border rounded-2xl" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Цена в месяц (₽) *</label>
                <input type="number" name="price" required value={form.price} onChange={handleChange}
                  className="w-full p-4 border rounded-2xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 font-medium">Количество комнат *</label>
                <input type="number" name="rooms" required value={form.rooms} onChange={handleChange}
                  className="w-full p-4 border rounded-2xl" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Площадь (м²)</label>
                <input type="number" name="area" value={form.area} onChange={handleChange}
                  className="w-full p-4 border rounded-2xl" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Этаж</label>
                <input type="number" name="floor" value={form.floor} onChange={handleChange}
                  className="w-full p-4 border rounded-2xl" />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Адрес *</label>
              <input type="text" name="address" required value={form.address} onChange={handleChange}
                className="w-full p-4 border rounded-2xl" />
            </div>

            <div>
              <label className="block mb-2 font-medium">Ссылка на фото</label>
              <input type="url" name="image" value={form.image} onChange={handleChange}
                className="w-full p-4 border rounded-2xl" />
            </div>

            <div>
              <label className="block mb-3 font-medium">Укажите расположение на карте</label>
              <YandexMap 
                latitude={coordinates?.lat} 
                longitude={coordinates?.lng} 
                onClick={(lat, lng, address) => {
                  setCoordinates({ lat, lng })
                  if (address) setForm(prev => ({ ...prev, address }))
                }} 
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Описание</label>
              <textarea 
                name="description" 
                rows={6} 
                value={form.description} 
                onChange={handleChange}
                className="w-full p-4 border rounded-2xl resize-y"
                placeholder="Подробное описание квартиры..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-5 rounded-2xl text-xl font-medium transition"
            >
              {loading ? 'Публикуем...' : 'Опубликовать объявление'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
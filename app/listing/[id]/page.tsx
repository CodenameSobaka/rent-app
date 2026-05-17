// app/listing/[id]/page.tsx
import { createClient } from '@/lib/supabase-server'
import Header from '@/components/Header'
import YandexMap from '@/components/YandexMap'

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  console.log("🔍 Загружаем объявление ID:", id)

  // Самый простой запрос
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !listing) {
    console.error("❌ Ошибка Supabase:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-3xl font-bold mb-4 text-red-600">Объявление не найдено</h2>
          <p className="text-gray-600 mb-6">ID: {id}</p>
          <a href="/search" className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700">
            ← Вернуться к поиску
          </a>
        </div>
      </div>
    )
  }

  // Загружаем профиль владельца отдельно
  let owner = null
  if (listing.user_id) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone')
      .eq('id', listing.user_id)
      .single()
    owner = data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <a href="/search" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 text-lg font-medium">
          ← Назад к поиску
        </a>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-[480px] bg-gray-100">
            {listing.images ? (
              <img src={listing.images} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🏠</div>
            )}
          </div>

          <div className="p-10 lg:p-12">
            <h1 className="text-4xl font-bold mb-3">{listing.title}</h1>
            <p className="text-4xl font-semibold text-blue-600 mb-10">
              {listing.price?.toLocaleString('ru-RU')} ₽ / месяц
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {listing.rooms && <div><p className="text-gray-500">Комнат</p><p className="text-3xl font-semibold">{listing.rooms}</p></div>}
              {listing.area && <div><p className="text-gray-500">Площадь</p><p className="text-3xl font-semibold">{listing.area} м²</p></div>}
              {listing.floor && <div><p className="text-gray-500">Этаж</p><p className="text-3xl font-semibold">{listing.floor}</p></div>}
            </div>

            <div className="mb-12">
              <p className="text-gray-500 mb-3 text-lg">Адрес</p>
              <p className="text-xl">{listing.address}</p>
            </div>

            <YandexMap latitude={listing.latitude} longitude={listing.longitude} />

            <div className="mt-14">
              <p className="text-gray-500 mb-4 text-lg">Описание</p>
              <p className="text-lg leading-relaxed whitespace-pre-line">{listing.description || 'Описание отсутствует'}</p>
            </div>

            {/* Владелец */}
            {owner && (
              <div className="mt-14 pt-10 border-t">
                <p className="text-gray-500 mb-4">Владелец объявления</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl">👤</div>
                  <div>
                    <p className="text-xl font-semibold">
                      {owner.first_name || ''} {owner.last_name || ''}
                    </p>
                    {owner.phone && <p className="text-blue-600 text-lg">📞 {owner.phone}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
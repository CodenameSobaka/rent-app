// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClientBrowser()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || ''
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        phone: profile.phone.trim(),
        updated_at: new Date().toISOString()
      })

    if (error) alert('Ошибка сохранения: ' + error.message)
    else alert('✅ Профиль успешно обновлён!')

    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка профиля...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <a 
          href="/search" 
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8 text-lg font-medium"
        >
          ← Назад
        </a>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Имя</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                className="w-full p-4 border rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Фамилия</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="w-full p-4 border rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Номер телефона</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-4 border rounded-2xl"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {saving ? 'Сохраняем...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
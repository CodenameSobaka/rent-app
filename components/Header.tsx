// components/Header.tsx
'use client'

import { createClientBrowser } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      if (data.session?.user) loadProfile(data.session.user.id)
    })
  }, [])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏠</span>
          <h1 className="text-2xl font-bold">Аренда Квартир</h1>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <a href="/profile" className="flex items-center gap-2 hover:text-blue-600 transition">
                👤 {profile?.first_name || user.email?.split('@')[0]}
              </a>
              <a href="/add" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700">
                + Добавить
              </a>
              <button onClick={handleLogout} className="text-red-600 hover:underline">
                Выйти
              </button>
            </>
          ) : (
            <a href="/login" className="font-medium">Войти</a>
          )}
        </div>
      </div>
    </header>
  )
}
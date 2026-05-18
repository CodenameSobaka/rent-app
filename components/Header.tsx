'use client'

import { createClientBrowser } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">АрендаКвартир</h1>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <a href="/profile" className="text-gray-700 hover:text-orange-600 font-medium transition">
                Профиль
              </a>
              <a 
                href="/add" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium transition"
              >
                + Добавить объявление
              </a>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <a href="/login" className="font-medium text-gray-700 hover:text-orange-600">Войти</a>
          )}
        </div>
      </div>
    </header>
  )
}
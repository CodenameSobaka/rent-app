// app/login/page.tsx
'use client'

import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  })

  const router = useRouter()
  const supabase = createClientBrowser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // Вход
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) setMessage(error.message)
        else router.push('/search')
      } else {
        // Регистрация
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: 'http://localhost:3000/search',
            data: {
              first_name: form.first_name,
              last_name: form.last_name,
              phone: form.phone
            }
          }
        })

        if (signUpError) {
          setMessage(signUpError.message)
        } else {
          setMessage('Регистрация успешна! Проверьте почту для подтверждения.')
        }
      }
    } catch (err: any) {
      setMessage('Произошла ошибка. Попробуйте ещё раз.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </h1>
        <p className="text-center text-gray-500 mb-8">Аренда квартир</p>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-2xl text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль (минимум 6 символов)"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
            required
          />

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="Имя"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Фамилия"
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Номер телефона"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-4 border rounded-2xl focus:outline-none focus:border-blue-500"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Подождите...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center mt-6 text-blue-600 hover:underline"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}
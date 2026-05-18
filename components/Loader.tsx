// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🏠</div>
      </div>
      <p className="text-gray-500 mt-6 text-lg">Загружаем объявления...</p>
    </div>
  )
}
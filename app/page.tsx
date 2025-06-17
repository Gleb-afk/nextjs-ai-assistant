"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-8">
      <h1 className="text-5xl font-bold tracking-tight text-center">
        Добро пожаловать в AI Assistant 🚀
      </h1>
      <p className="mt-4 text-xl text-gray-300 text-center max-w-lg">
        Ваш персональный помощник на базе искусственного интеллекта. Запросите код, информацию или идеи — всё в одном месте!
      </p>

      <div className="flex space-x-4 mt-6">
        <Link href="/chat">
          <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-400 transition-all text-white font-semibold text-lg">
            🔥 Начать чат
          </button>
        </Link>
        <Link href="/docs">
          <button className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white font-semibold text-lg">
            📖 Документация
          </button>
        </Link>
      </div>

      <div className="absolute bottom-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} AI Assistant, все права защищены.
      </div>
    </main>
  );
}

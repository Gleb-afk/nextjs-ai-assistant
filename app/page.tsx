// app/page.tsx
'use client'
import { useAIContext } from '@/context/AIContext'

export default function HomePage() {
  const { suggestions, dismissSuggestion, applySuggestion } = useAIContext()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Ассистент</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Рекомендации
          <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {suggestions.length}
          </span>
        </h2>

        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="ai-recommendation">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{suggestion.title}</h3>
                    <p className="text-gray-600 text-sm">{suggestion.message}</p>
                  </div>
                  <button 
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {suggestion.codeSample && (
                  <div className="mt-3">
                    <pre className="ai-recommendation-code">
                      {suggestion.codeSample}
                    </pre>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Применить
                      </button>
                      <button
                        onClick={() => suggestion.codeSample && navigator.clipboard.writeText(suggestion.codeSample)}
                        className={`btn-secondary text-sm px-3 py-1 ${
                        !suggestion.codeSample ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      disabled={!suggestion.codeSample}
                      >
                        Копировать код
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Нет активных рекомендаций</p>
          </div>
        )}
      </div>
    </div>
  )
}
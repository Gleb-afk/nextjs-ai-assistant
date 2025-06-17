'use client'
import { type AISuggestion } from '@/types'
import { useAIContext } from '@/context/AIContext'
import { groupBy } from '@/lib/utils'

type PriorityKey = 'Critical' | 'High' | 'Medium' | 'Low'
type PriorityOrder = {
  [key in PriorityKey]: number
}

export function AIRecommendationsOverlay({ suggestions }: { 
  suggestions: AISuggestion[] 
}) {
  const { applySuggestion, dismissSuggestion } = useAIContext()

  const priorityOrder: PriorityOrder = {
    'Critical': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4
  }

  const groupedSuggestions = groupBy(suggestions, 'type')
  const sortedTypes = Object.keys(groupedSuggestions).sort((a, b) => {
    const priorityA = priorityOrder[a as PriorityKey] || Infinity
    const priorityB = priorityOrder[b as PriorityKey] || Infinity
    return priorityA - priorityB
  })
  return (
    <div className="absolute right-4 top-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-xl max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">AI Recommendations</h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {suggestions.length} items
        </span>
      </div>
      
      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {sortedTypes.map(type => (
          <div key={type}>
            <h4 className="font-medium text-gray-700 mb-1">{type}</h4>
            {groupedSuggestions[type].map((suggestion, index) => (
              <div key={`${type}-${index}`} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{suggestion.title}</span>
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      {suggestion.priority}
                    </span>
                  </div>
                  <button onClick={() => dismissSuggestion(suggestion.id)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <p className="mt-2 text-sm text-gray-600">{suggestion.message}</p>
                
                {suggestion.codeSample && (
                  <div className="mt-3">
                    <pre className="text-xs bg-gray-100 p-2 rounded">{suggestion.codeSample}</pre>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => applySuggestion(suggestion)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Apply</button>
                      <button onClick={() => {if (suggestion.codeSample) {navigator.clipboard
                        .writeText(suggestion.codeSample)}}}
                        className="text-xs border border-gray-300 px-3 py-1 rounded"disabled={!suggestion.codeSample}>Copy</button>                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
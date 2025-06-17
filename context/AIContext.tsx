'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { type AISuggestion } from '@/types'

type AIContextType = {
  suggestions: AISuggestion[]
  addSuggestion: (suggestion: AISuggestion) => void
  applySuggestion: (suggestion: AISuggestion) => void
  dismissSuggestion: (id: string) => void
}

const AIContext = createContext<AIContextType | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  
  const addSuggestion = (suggestion: AISuggestion) => {
    setSuggestions(prev => [...prev, suggestion])
  }
  
  const applySuggestion = (suggestion: AISuggestion) => {
    console.log('Applying suggestion:', suggestion)
    dismissSuggestion(suggestion.id)
  }
  
  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  return (
    <AIContext.Provider value={{ suggestions, addSuggestion, applySuggestion, dismissSuggestion }}>
      {children}
    </AIContext.Provider>
  )
}

export function useAIContext() {
  const context = useContext(AIContext)
  if (!context) throw new Error('useAIContext must be used within AIProvider')
  return context
}
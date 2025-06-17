export type SuggestionType = 'performance' | 'security' | 'refactoring' | 'documentation'
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low'
// Тип для ИИ-рекомендаций
export interface AISuggestion {
    id: string
    type: SuggestionType
    title: string
    message: string
    codeSample?: string
    priority: PriorityLevel
    filePath?: string        // Путь к файлу с проблемой
    lineNumber?: number      // Номер строки с проблемой
    category?: 'ui' | 'logic' | 'api' // Категория проблемы
  }

  export type GroupedSuggestions = Record<string, AISuggestion[]>
  
  // Тип для ответов оптимизации
  export interface OptimizationResult {
    originalSize: number;     // Размер кода до оптимизации (в байтах)
    optimizedSize: number;    // Размер после оптимизации
    metrics: {
      fcp: number;            // First Contentful Paint
      lcp: number;            // Largest Contentful Paint
      tti: number;            // Time to Interactive
    };
    suggestions: string[];    // Список предложений
  }
  
  // Тип для векторных данных
  export interface VectorRecord {
    id: string;
    vector: number[];
    metadata: {
      componentName: string;
      codeHash: string;
    };
  }
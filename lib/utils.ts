// Группировка предложений по типу
export function groupBy<T>(array: T[], key: keyof T) {
    return array.reduce((acc, item) => {
      const group = item[key] as string
      if (!acc[group]) acc[group] = []
      acc[group].push(item)
      return acc
    }, {} as Record<string, T[]>)
  }
  
  // Поиск похожих компонентов
  export async function findSimilarComponents(embedding: number[]) {
    // Реализация поиска в векторной БД
    return []
  }
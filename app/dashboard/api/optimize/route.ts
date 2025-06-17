import { NextResponse } from 'next/server'
import { optimizeWithAI } from '@vercel/ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { code, metrics } = await req.json()
  
  try {
    const optimizationStream = await optimizeWithAI({
      model: 'claude-3-haiku',
      prompt: `Проанализируй код Next.js компонента и предложи оптимизации:
      **Код**: ${code}
      **Метрики производительности**: ${JSON.stringify(metrics)}
      Сфокусируйся на:
      - Сокращении размера бандла
      - Улучшении Core Web Vitals
      - Оптимизации запросов данных
      Предложи конкретные изменения кода.`
    })
    
    return new Response(optimizationStream, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 })
  }
}
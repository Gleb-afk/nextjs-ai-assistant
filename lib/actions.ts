'use server'
import OpenAI from 'openai'
import { createVectorEmbedding } from '@/lib/vector-db'
import { ratelimit } from '@/lib/ratelimit'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateComponent(prompt: string, context: string[]) {
  const { success } = await ratelimit.limit('ai_generation')
  if (!success) throw new Error('Rate limit exceeded')
  
  const contextEmbedding = await createVectorEmbedding(context.join('\n'))
  const similarComponents = await findSimilarComponents(contextEmbedding)
  
  const systemMessage = `Ты эксперт по Next.js 14. Сгенерируй код компонента с учетом:
  - Используй Typescript и React Server Components
  - Tailwind CSS для стилей
  ${similarComponents.length ? `- Учти стиль: ${similarComponents[0].code.slice(0, 200)}...` : ''}
  Выводи только чистый код без пояснений.`
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    stream: true
  })
  
  let generatedCode = ''
  for await (const chunk of response) {
    const content = chunk.choices[0]?.delta?.content || ''
    generatedCode += content
  }
  
  return cleanCode(generatedCode)
}

function cleanCode(code: string): string {
  return code.replace(/```(jsx|tsx)?/g, '').trim()
}
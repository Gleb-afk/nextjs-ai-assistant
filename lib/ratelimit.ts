import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Инициализация Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Конфигурация лимитов для разных операций
const limiters = {
  generation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 запросов в час
    prefix: 'ratelimit:generation',
  }),
  analysis: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '10 m'), // 50 запросов в 10 мин
    prefix: 'ratelimit:analysis',
  }),
  optimization: new Ratelimit({
    redis,
    limiter: Ratelimit.tokenBucket(20, '10 s', 5), // 20 запросов, 5 токенов/сек
    prefix: 'ratelimit:optimization',
  }),
}

// Проверка лимитов
export const checkRateLimit = async (
  operation: keyof typeof limiters,
  userId: string
): Promise<{ success: boolean; message?: string }> => {
  const { success, pending, reset } = await limiters[operation].limit(userId)
  
  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    return {
      success: false,
      message: `Превышен лимит запросов. Попробуйте через ${retryAfter} сек.`,
    }
  }
  
  await pending // Ожидание при высокой нагрузке
  return { success: true }
}

// Middleware для Next.js API
export const rateLimitMiddleware = async (
  req: NextRequest,
  operation: keyof typeof limiters
) => {
  const userId = req.headers.get('x-user-id') || 'anonymous'
  const result = await checkRateLimit(operation, userId)
  
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.message }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
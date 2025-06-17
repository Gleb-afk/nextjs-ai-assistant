import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Получаем API-ключ из переменных окружения
    const apiKey = "Oh6Zz2gkS9C9MPdvV9iDXmJLlqs14VmM";
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY не задан в .env файле');
    }

    // 2. Парсим промпт из тела запроса
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Параметр 'prompt' обязательный" },
        { status: 400 }
      );
    }

    // 3. Отправляем запрос в Mistral API через fetch
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-tiny", // или mistral-small, mistral-medium
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    // 4. Обрабатываем ответ
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Ошибка Mistral API');
    }

    const data = await response.json();

    // 5. Возвращаем результат
    return NextResponse.json({ 
      result: data.choices[0]?.message?.content 
    });

  } catch (error) {
    // Обработка ошибок
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 500 }
    );
  }
}
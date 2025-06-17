import { MistralClient } from "@mistral-ai/client";

const mistral = new MistralClient({
  apiKey: "Oh6Zz2gkS9C9MPdvV9iDXmJLlqs14VmM",
});

const RATE_LIMIT = {
  requestsPerSecond: 1,
  tokensPerMinute: 500000,
};

let lastRequestTime = 0;

export async function generateResponse(prompt: string) {
  const currentTime = Date.now();
  if (currentTime - lastRequestTime < 1000) {
    throw new Error("Превышен лимит запросов. Попробуйте позже.");
  }

  lastRequestTime = currentTime;

  try {
    const response = await mistral.chat.complete({
      model: "mistral-tiny",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Ошибка при запросе к Mistral AI:", error);
    return "Произошла ошибка при обработке запроса.";
  }
}

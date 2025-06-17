import { MistralClient } from "@mistral-ai/client";

const mistral = new MistralClient({
  apiKey: "Oh6Zz2gkS9C9MPdvV9iDXmJLlqs14VmM",
});

export async function generateResponse(prompt: string) {
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

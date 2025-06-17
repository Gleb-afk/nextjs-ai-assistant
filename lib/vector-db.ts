import { Pinecone } from "@pinecone-database/pinecone";
import crypto from "crypto";

export function hash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

const PINECONE_API_KEY = "pcsk_7YKb9A_UCBfcBPNqhQNuWmxQD6GgevcmuyuNr3hREoL72YKdpvonNRPZbQjk78L9Sqw6DD";
const MISTRAL_API_KEY = "Oh6Zz2gkS9C9MPdvV9iDXmJLlqs14VmM";

// Создаем Pinecone с API-ключом
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: "us-east-1", // Добавляем обязательное поле
});


const index = pinecone.index("component-vectors");

// Функция для создания векторного embedding с Mistral AI
export const createVectorEmbedding = async (text: string): Promise<number[]> => {
  console.log("Отправляем запрос в Mistral API...");
  const response = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: ["Hello world"], model: "mistral-7b" }),
  });    

  const data = await response.json();
  console.log("Mistral API Response:", JSON.stringify(data, null, 2));
  return data.embeddings[0];
};

// Поиск похожих компонентов в Pinecone (исправленный формат запроса)
export const findSimilarComponents = async (embedding: number[], topK = 3) => {
  const results = await index.query({
    vector: embedding, // Используем "vector" вместо "query"
    topK,
    includeMetadata: true,
  });
  

  return results.matches.map(match => ({
    id: match.id,
    vector: match.values,
    metadata: match.metadata ?? {},
  }));
};

// Сохранение компонента в Pinecone
export const saveComponentVector = async (componentName: string, code: string): Promise<string> => {
  const embedding = await createVectorEmbedding(code);
  const id = `comp_${Date.now()}`;

  await index.upsert([
    { id, values: embedding, metadata: { componentName, codeHash: hash(code) } }
  ]);
  
  return id;
};

// Генерация ответа (embedding)
export const generateResponse = async (text: string): Promise<number[]> => {
  return createVectorEmbedding(text);
};
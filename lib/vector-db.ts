import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@langchain/embeddings/openai'

// Инициализация клиента Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: 'gcp-starter'
})
const index = pinecone.index('component-vectors')

// Создание векторного embedding
export const createVectorEmbedding = async (text: string): Promise<number[]> => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-small'
  })
  
  return embeddings.embedQuery(text)
}

// Поиск похожих компонентов
export const findSimilarComponents = async (
  embedding: number[], 
  topK = 3
): Promise<VectorRecord[]> => {
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true
  })
  
  return results.matches.map(match => ({
    id: match.id,
    vector: match.values,
    metadata: match.metadata as VectorRecord['metadata']
  }))
}

// Сохранение компонента в векторную БД
export const saveComponentVector = async (
  componentName: string,
  code: string
): Promise<string> => {
  const embedding = await createVectorEmbedding(code)
  const id = `comp_${Date.now()}`
  
  await index.upsert([{
    id,
    values: embedding,
    metadata: { componentName, codeHash: hash(code) }
  }])
  
  return id
}
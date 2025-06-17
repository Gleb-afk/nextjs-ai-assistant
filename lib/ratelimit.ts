export async function generateResponse(prompt: string): Promise<string> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer Oh6Zz2gkS9C9MPdvV9iDXmJLlqs14VmM`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistral-tiny',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  return data.choices[0]?.message?.content;
}
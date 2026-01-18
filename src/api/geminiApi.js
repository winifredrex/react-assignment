export async function fetchBookRecommendations(prompt, apiKey) {
  if (!apiKey || apiKey.trim().length < 20) {
    throw new Error('Missing API key');
  }

  const MODEL = 'gemini-2.5-flash';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024
        }
      })
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Gemini API error');
  }

  return await response.json();
}

export function createBookPrompt(genre, mood, level) {
  return `Recommend 6 specific books for someone who:
- Loves ${genre} books
- Is feeling ${mood}
- Is a ${level} level reader

For each book, provide:
1. Title and Author
2. Why it matches the ${mood} mood
3. Why it's good for ${level} readers

Format with clear numbering and make it engaging!`;
}
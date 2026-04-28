export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, max_tokens = 1000 } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://helpaii.vercel.app',
        'X-Title': 'Amada AI'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        max_tokens,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

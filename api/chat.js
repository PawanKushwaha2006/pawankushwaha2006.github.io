export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, lang } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message missing' });
  }

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Tum Naughty AI ho. User language: ${lang}. User sawal: ${message}. Thoda flirty, funny, Hinglish me jawab do. Max 2 line.` }] }]
      })
    });

    const data = await geminiRes.json();

    // Error check
    if (!geminiRes.ok) {
      console.log(data);
      return res.status(200).json({ reply: data.error?.message || 'API Error, key check karo' });
    }

    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Thoda alag tarike se poochho 😊';

    return res.status(200).json({ reply: replyText, text: replyText });

  } catch (e) {
    return res.status(200).json({ reply: 'Server error: ' + e.message, text: 'Server error' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body || {};
  if (!to || !text) {
    return res.status(400).json({ error: "Missing 'to' or 'text'." });
  }

  try {
    const r = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.TELNYX_NUMBER,
        to,
        text,
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}

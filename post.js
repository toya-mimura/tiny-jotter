// Cloudflare Pages Function
// POST /api/post → Discord Webhook
//
// Auth is handled by Cloudflare Access (Zero Trust) at the edge.
// This function only needs one env var:
//   DISCORD_WEBHOOK_URL  – Discord webhook URL

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = { 'Content-Type': 'application/json' };

  try {
    const { text, tag } = await request.json();

    // ── Validate ──
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'empty text' }), {
        status: 400,
        headers,
      });
    }

    // ── Build Discord message ──
    const timestamp = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });

    let content = text.trim();
    if (tag) {
      content = `\`${tag}\`\n${content}`;
    }
    content += `\n-# ${timestamp}`;

    // ── Send to Discord ──
    const discordRes = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error('Discord error:', discordRes.status, errText);
      return new Response(JSON.stringify({ error: 'discord_error' }), {
        status: 502,
        headers,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('Worker error:', err);
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers,
    });
  }
}

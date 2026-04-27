export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2025-06-03",
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "failed" }, { status: 500 });
  }

  const data = await res.json();

  return Response.json({
    clientSecret: data.client_secret.value,
  });
}
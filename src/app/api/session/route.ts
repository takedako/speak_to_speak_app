export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
//   const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       session: {
//         type: "realtime",
//         model: "gpt-4o-realtime-preview-2025-06-03",
//       },
//     }),
//   });

//   if (!res.ok) {
//     const text = await res.text(); // ←デバッグ用
//     console.error(text);
//     return Response.json({ error: "failed" }, { status: 500 });
//   }

//   const data = await res.json();
//   console.log(data)
  
//   return Response.json({
//     clientSecret: data.client_secret.value,
//   });
  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: "gpt-realtime-1.5",
      },
    }),
  });

  const text = await res.text();
  console.log("OpenAI response:", text);

  if (!res.ok) {
    return new Response(text, { status: 500 });
  }

  const data = JSON.parse(text);

  console.log(data)

  if (!res.ok) {
    return Response.json({ error: data }, { status: 500 });
  }

  return Response.json({
    clientSecret: data.value,
  });
}
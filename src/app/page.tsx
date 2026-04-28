import { VoiceCallButton } from "@/components/VoiceCallButton";

// async function getSessionApiKey() {
//   const apiKey = process.env.OPENAI_API_KEY;

//   if (!apiKey) {
//     throw new Error("OPENAI_API_KEY is not set");
//   }

//   const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "gpt-realtime-1.5",
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to create session");
//   }

//   const data = await res.json();
//   return data.client_secret.value;
// }

export default async function Home() {
  // const sessionApiKey = await getSessionApiKey();
  return (
    <div className="h-screen flex items-center justify-center">
      <VoiceCallButton />
    </div>
  );
}
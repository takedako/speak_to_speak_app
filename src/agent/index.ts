import { tool, RealtimeAgent } from '@openai/agents/realtime';
import { z } from 'zod';

const getWeather = tool({
  name: 'get_weather',
  description: 'Return the weather for a city.',
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
    return `The weather in ${city} is sunny.`;
  },
});

export const weatherAgent = new RealtimeAgent({
  name: 'Weather assistant',
  instructions: 'Answer weather questions.',
  tools: [getWeather],
});

// export const agent = new RealtimeAgent({
//   name: "Assistant",
//   instructions: "You are a helpful assistant.",
// });

// const session = new RealtimeSession(agent, {
//   model: "gpt-4o-realtime-preview-2025-06-03",
// });

// (session as any).on?.("error", (e: any) => {
//   console.error("SESSION ERROR:", e);
// });

// (session as any).on?.("close", () => {
//   console.log("SESSION CLOSED");
// });
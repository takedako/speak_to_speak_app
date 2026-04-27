import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

const agent = new RealtimeAgent({
  name: "Assistant",
  instructions: "You are a helpful assistant.",
});

export const session = new RealtimeSession(agent, {
  model: "gpt-4o-realtime-preview-2025-06-03",
});
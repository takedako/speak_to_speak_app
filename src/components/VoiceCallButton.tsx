"use client";

import { useRef, useState } from "react";
import { Mic, PhoneOff } from "lucide-react";
import { weatherAgent } from "@/agent";
import { RealtimeSession } from "@openai/agents-realtime";

export function VoiceCallButton() {
  const [inCall, setInCall] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);


  const toggleCall = async () => {    
    try {
      // 通話終了
      if (inCall) {
        if (sessionRef.current) {
          sessionRef.current.interrupt();
          sessionRef.current = null;
        }
        setInCall(false);
        return;
      }

      const session = new RealtimeSession(weatherAgent, { 
          model: "gpt-realtime-1.5",
      });

        const res = await fetch("/api/session", { method: "POST" });

        if (!res.ok) {
          const text = await res.text();
          console.error("API error:", text);
          throw new Error("API failed");
        }

        const data = await res.json();

        await session.connect({
          apiKey: data.clientSecret,
          model: "gpt-realtime-1.5",
        });

        sessionRef.current = session;
        setInCall(true);
      
    } catch (err) {
      console.error("toggleCall error:", err);
    }
};

  return (
    <button
      onClick={toggleCall}
      className={`w-24 h-24 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        inCall
          ? "bg-red-600 hover:bg-red-700 focus:ring-red-400"
          : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400"
      }`}
    >
      {inCall ? (
        <PhoneOff className="h-10 w-10 text-white" />
      ) : (
        <Mic className="h-10 w-10 text-white" />
      )}
    </button>
  );
}
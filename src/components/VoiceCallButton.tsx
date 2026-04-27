"use client";

import { useState } from "react";
import { Mic, PhoneOff } from "lucide-react";
import { session } from "@/agent";

interface VoiceCallButtonProps {
  sessionApiKey: string;
}

export function VoiceCallButton({ sessionApiKey }: VoiceCallButtonProps) {
  const [inCall, setInCall] = useState(false);

  const toggleCall = async () => {
    // if (inCall) {
    //   session.close();
    // } else {
    //   await session.connect({ apiKey: sessionApiKey });
    // }
    // setInCall(!inCall);
  if (inCall) {
    session.close();
    setInCall(false);
    return;
  }

  // ★ここで毎回新しいセッション取得
  const res = await fetch("/api/session", { method: "POST" });
  const data = await res.json();

  await session.connect({
    apiKey: data.clientSecret,
  });

  setInCall(true);
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
"use client";

import { useState } from "react";
import { Mic, PhoneOff } from "lucide-react";
import { weatherAgent } from "@/agent";
import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";


interface VoiceCallButtonProps {
  sessionApiKey: string;
}

export function VoiceCallButton({ sessionApiKey }: VoiceCallButtonProps) {
  const [inCall, setInCall] = useState(false);

  const toggleCall = async () => {
    console.log("🚨 toggleCall called", Date.now());
    
  try {
    const minimalAgent = new RealtimeAgent({
  name: "test",
  instructions: "Just respond briefly.",
  tools: [],
});
    const session = new RealtimeSession(minimalAgent, { 
      model: "gpt-realtime-1.5",
      config: {
    outputModalities: ['audio'],
    audio: {
      input: {
        format: 'pcm16',
        transcription: {
          model: 'gpt-4o-mini-transcribe',
        },
      },
      output: {
        format: 'pcm16',
      },
    }}
    });
    
    console.log("🧠 session created", session);

    console.log("before connect", session);

    if (inCall) {
      session.close();
      setInCall(false);
      return;
    } 
    console.log("session instance:", session);

    const transport = (session as any).transport;

    console.log("pc:", transport?._pc);
    console.log("has datachannel:", transport?._dataChannel !== undefined);
    console.log("senders:", transport?._pc?.getSenders());
    console.log("datachannels:", transport?._pc?.sctp);
    // const pc = transport.peerConnection;
    // console.log(pc);

    // if (pc) {
    //   pc.onconnectionstatechange = () => {
    //     console.log("connectionState:", pc.connectionState);
    //   };

    //   pc.onsignalingstatechange = () => {
    //     console.log("signalingState:", pc.signalingState);
    //   };

    //   pc.oniceconnectionstatechange = () => {
    //     console.log("iceConnectionState:", pc.iceConnectionState);
    //   };
    // }

    const res = await fetch("/api/session", { method: "POST" });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      throw new Error("API failed");
    }

    const data = await res.json();

    console.log(data);
    // console.log("before connect");

    // await session.connect({
    //   apiKey: data.clientSecret,
    // });

    // console.log("after connect");
    console.log("before connect");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(stream.getAudioTracks());
    console.log(stream.active);
    console.log("mic OK");

    const p = session.connect({
      apiKey: data.clientSecret,
      model: "gpt-realtime-1.5",
    });

    console.log("connect returned", p);

    // console.log((session as any)["#transport"]?.state);

    // console.log((session as any)["#transport"]?.state);
    // console.log((session as any)["#transport"]?.connectPromise);

//     console.log(session);
// console.log((session as any)["#transport"]);
// console.log((session as any)["#eventEmitter"]);

    console.log("connect returned promise");

    await p;

    console.log("after connect", session);

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
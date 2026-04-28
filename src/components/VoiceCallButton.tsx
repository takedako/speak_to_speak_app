"use client";

import { useRef, useState } from "react";
import { Mic, PhoneOff } from "lucide-react";
import { weatherAgent } from "@/agent";
import { RealtimeSession } from "@openai/agents-realtime";


// interface VoiceCallButtonProps {
//   sessionApiKey: string;
// }

export function VoiceCallButton() {
  const [inCall, setInCall] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);


  const toggleCall = async () => {    
    try {
      // 通話終了
      if (inCall) {
        if (sessionRef.current) {
          sessionRef.current.interrupt();
          sessionRef.current = null; // 後片付け
        }
        setInCall(false);
        return;
      }

      // const minimalAgent = new RealtimeAgent({
      //   name: "test",
      //   instructions: "Just respond briefly.",
      //   tools: [],
      // });
      const session = new RealtimeSession(weatherAgent, { 
          model: "gpt-realtime-1.5",
      });

        console.log("session instance:", session);

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

        console.log("connect returned promise");

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
// "use client";
// import { useState, useRef } from "react";
// import { Mic, PhoneOff } from "lucide-react";

// export function VoiceCallButton() {
//   const [inCall, setInCall] = useState(false);
//   const pcRef = useRef<RTCPeerConnection | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const startCall = async () => {
//     try {
//       // 1. ephemeral key を取得
//       const res = await fetch("/api/session", { method: "POST" });
//       if (!res.ok) throw new Error("API failed");
//       const data = await res.json();
//       const ephemeralKey = data.clientSecret;

//       // 2. RTCPeerConnection を作成
//       // const pc = new RTCPeerConnection();
//       const pc = new RTCPeerConnection({
//         iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         iceTransportPolicy: "all",
//       });
//       pcRef.current = pc;

//       // ICE接続状態の監視
//       pc.oniceconnectionstatechange = () => {
//         console.log("ICE state:", pc.iceConnectionState);
//       };

//       pc.onicecandidate = (e) => {
//         console.log("ICE candidate:", e.candidate);
//       };

//       pc.onconnectionstatechange = () => {
//         console.log("Connection state:", pc.connectionState);
//       };

//       pc.ontrack = (e) => {
//         console.log("ontrack fired!", e.streams);
//         audio.srcObject = e.streams[0];
//       };


//       // 3. AIの音声を再生するための audio 要素をセット
//       const audio = new Audio();
//       audio.autoplay = true;
//       audioRef.current = audio;
//       pc.ontrack = (e) => {
//         audio.srcObject = e.streams[0];
//       };

//       // 4. マイクを追加
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//       // 5. SDP offer を作成して送信
//       // const offer = await pc.createOffer();
//       // await pc.setLocalDescription(offer);

//       // const sdpRes = await fetch(
//       //   "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
//       //   {
//       //     method: "POST",
//       //     headers: {
//       //       Authorization: `Bearer ${ephemeralKey}`,
//       //       "Content-Type": "application/sdp",
//       //     },
//       //     body: offer.sdp,
//       //   }
//       // );
//       // offer作成
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       console.log("Local SDP:", offer.sdp); // ← 追加

//       // ICE gatheringが完了するまで待つ
//       await new Promise<void>((resolve) => {
//         if (pc.iceGatheringState === "complete") {
//           resolve();
//         } else {
//           pc.onicegatheringstatechange = () => {
//             console.log("ICE gathering state:", pc.iceGatheringState);
//             if (pc.iceGatheringState === "complete") resolve();
//           };
//         }
//       });

//         // gathering完了後のSDPを送る
//         const sdpRes = await fetch(
//           "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${ephemeralKey}`,
//               "Content-Type": "application/sdp",
//             },
//             body: pc.localDescription!.sdp, // ← gatheringが完了したSDPを使う
//           }
//         );

//       if (!sdpRes.ok) throw new Error("SDP exchange failed");

//       // 6. answer をセット → WebRTC確立
//       const answerSdp = await sdpRes.text();
//       await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

//       setInCall(true);
//     } catch (err) {
//       console.error("startCall error:", err);
//     }
//   };

//   const stopCall = () => {
//     pcRef.current?.getSenders().forEach((s) => s.track?.stop());
//     pcRef.current?.close();
//     pcRef.current = null;
//     if (audioRef.current) {
//       audioRef.current.srcObject = null;
//     }
//     setInCall(false);
//   };

//   const toggleCall = () => (inCall ? stopCall() : startCall());

//   return (
//     <button
//       onClick={toggleCall}
//       className={`w-24 h-24 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
//         inCall
//           ? "bg-red-600 hover:bg-red-700 focus:ring-red-400"
//           : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400"
//       }`}
//     >
//       {inCall ? (
//         <PhoneOff className="h-10 w-10 text-white" />
//       ) : (
//         <Mic className="h-10 w-10 text-white" />
//       )}
//     </button>
//   );
// }
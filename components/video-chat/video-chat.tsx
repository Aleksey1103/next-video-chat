'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const VideoChat: React.FC = () => {
  const { id: roomId } = useParams();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = io({
      path: '/api/socket', // connect to Next.js API route
    });
    socketRef.current = socket;

    socket.emit('join', roomId);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // add your TURN here
      ],
    });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, roomId });
      }
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });

    socket.on('offer', async (offer) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit('answer', { answer, roomId });
    });

    socket.on('answer', async (answer) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ICE candidate', err);
      }
    });

    return () => {
      socket.disconnect();
      pc.close();
    };
  }, [roomId]);

  const startCall = async () => {
    if (!pcRef.current || !socketRef.current || !roomId) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socketRef.current.emit('offer', { offer, roomId });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 rounded-lg shadow" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 rounded-lg shadow" />
      </div>
      <button onClick={startCall} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
        Start Call
      </button>
    </div>
  );
};

export default VideoChat;

"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

interface VideoCallContextType {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isCallActive: boolean
  startCall: (contactId: string) => Promise<void>
  endCall: () => void
  toggleAudio: () => void
  toggleVideo: () => void
  isAudioEnabled: boolean
  isVideoEnabled: boolean
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined)

export function VideoCallProvider({ children }: { children: ReactNode }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    }

    const pc = new RTCPeerConnection(configuration)
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, you would send this to the remote peer via your signaling server
        console.log("New ICE candidate:", event.candidate)
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    peerConnection.current = pc
  }

  const startCall = async (contactId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      
      setLocalStream(stream)
      setIsCallActive(true)
      
      if (peerConnection.current) {
        stream.getTracks().forEach((track) => {
          if (localStream) {
            peerConnection.current?.addTrack(track, stream)
          }
        })
      }
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    setLocalStream(null)
    setRemoteStream(null)
    setIsCallActive(false)
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  useEffect(() => {
    initializePeerConnection()
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close()
      }
    }
  }, [])

  return (
    <VideoCallContext.Provider
      value={{
        localStream,
        remoteStream,
        isCallActive,
        startCall,
        endCall,
        toggleAudio,
        toggleVideo,
        isAudioEnabled,
        isVideoEnabled,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  )
}

export function useVideoCall() {
  const context = useContext(VideoCallContext)
  if (context === undefined) {
    throw new Error("useVideoCall must be used within a VideoCallProvider")
  }
  return context
} 
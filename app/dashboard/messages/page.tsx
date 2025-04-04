"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Paperclip, Phone, Send, Video, X, Users, Mic, MicOff, VideoOff } from "lucide-react"
import { useMessages, type Contact } from "@/contexts/message-context"
import { useVideoCall } from "@/contexts/video-call-context"

export default function MessagesPage() {
  const { contacts, messages, activeContactId, setActiveContactId, addMessage } = useMessages()
  const { 
    localStream, 
    remoteStream, 
    isCallActive, 
    startCall, 
    endCall, 
    toggleAudio, 
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled
  } = useVideoCall()
  const [newMessage, setNewMessage] = useState("")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const activeContact = contacts.find((contact) => contact.id === activeContactId) || null
  const activeMessages = activeContactId ? messages[activeContactId] || [] : []

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleContactSelect = (contact: Contact) => {
    setActiveContactId(contact.id)
    if (isCallActive) {
      endCall()
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContactId) return

    addMessage(activeContactId, {
      senderId: "me",
      text: newMessage,
      timestamp: "Just now",
      isMe: true,
    })

    setNewMessage("")
  }

  const handleStartVideoCall = async () => {
    if (activeContactId) {
      await startCall(activeContactId)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div className="w-full border-r md:w-80">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <Tabs defaultValue="all">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <div className="divide-y">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 ${
                    activeContactId === contact.id ? "bg-muted/50" : ""
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        contact.status === "online"
                          ? "bg-green-500"
                          : contact.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <div className="p-4 text-center text-muted-foreground">No unread messages</div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeContact.avatar || "/placeholder-user.jpg"} />
                  <AvatarFallback>
                    {activeContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{activeContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeContact.status === "online"
                      ? "Online"
                      : activeContact.status === "away"
                        ? "Away"
                        : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => {}}>
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleStartVideoCall}>
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {isCallActive ? (
              <div className="flex-1 bg-gray-900 relative flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleAudio} className="bg-gray-800 hover:bg-gray-700">
                    {isAudioEnabled ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleVideo} className="bg-gray-800 hover:bg-gray-700">
                    {isVideoEnabled ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={endCall}>
                    <X className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
                <div className="w-full max-w-2xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-8 right-8 w-32 aspect-video bg-gray-700 rounded-lg border border-gray-600 shadow-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {activeMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.isMe ? "bg-blue-500 text-white" : "bg-muted"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${message.isMe ? "text-blue-100" : "text-muted-foreground"}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground mt-2">Choose a contact from the list to start messaging</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


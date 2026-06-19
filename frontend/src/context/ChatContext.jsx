import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useSocket } from './SocketContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const { socketId } = useSocket();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null)
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  
  const connectSocket = () => {
    if(socket) {
      socket.connect(); 
    }
  }

  const sendMessage = (content, type = 'text', chatId) => {
    // console.log('Sending message:', content, type);
    if(socket) {
      socket.emit('sendMessage', {
        chatId,
        userId: user._id,
        content,
        contentType: type
      });
      const newMessage = {
        _id: Date.now(),
        content,
        contentType: type,
        senderId: user._id, 
        timestamp: new Date(),
        seen: false
      }
      setMessages(prev => [...prev, newMessage])
    }
  }

  const startChat = (partner) => {
    try{
      const response = axios.post(`${backendUrl}/api/chat/create`, {
        socketId: socketId,
      }, {
        withCredentials: true
      });

      response.then(res => {
        if(res.data.success) {
          if(res.data.status === 'waiting') {
            setIsMatching(true);
            setTimeout(() => {
              setIsMatching(false);
              toast.dismiss('matching');
              toast.error('No match found! Please try again');
            }, 30000);
            toast.loading('Waiting for a match...', { id: 'matching' });
          } else if(res.data.status === 'matched') {
            const newChat = res.data.chat;
            setChat(newChat);
            setActiveChat(newChat.partner);
            toast.dismiss('matching');
            setIsMatching(false);
            navigate(`/chat/${newChat._id}`);
          }
        }
      }).catch(err => {
        console.error('Error starting chat:', err)
      });
    }catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  useEffect(() => {
    if(socket) {
      socket.on('matchFound', (data) => {
        // console.log('Match found:', data);
        setIsMatching(false);
        toast.dismiss('matching');
        navigate(`/chat/${data?.chat?._id}`);
      });
      
      socket.on('newMessage', (data) => {
        // console.log('New message:', data);
        const newMessage = {
          _id: data._id || Date.now(),
          content: data.content,
          contentType: data.contentType,
          senderId: data.senderId,
          timestamp: new Date(data.timestamp || Date.now()),
          seen: false
        }
        setMessages(prev => [...prev, newMessage]);
      });

      socket.on('typingStatus', (data) => {
        console.log('Typing status:', data);
        setIsTyping(data.status);
      });

      socket.on('partnerStatus', (data) => {
        setIsOnline(data);
      });

      socket.on('endChat', (data) => {
        // console.log('Chat ended:', data);
        setChat(prev => ({ ...prev, status: 'inactive' }));
      });
    }

    return () => {
      if(socket) {
        socket.off('matchFound');
        socket.off('newMessage');
        socket.off('typingStatus');
        socket.off('partnerStatus');
        socket.off('endChat');
      }
    }
  }, [socket]);

  const typingStatus = (status, chatId) => {
    if(socket) {
      
      socket.emit('typingStatus', {
        userId: user?._id,
        chatId,
        status
      });    
    }
  }
  
  const endChat = (chatId) => {
    if(socket) {

      socket.emit('endChat', {
        userId: user._id,
        chatId
      });
      setChat({...chat, status : 'inactive'});
      // navigate('/dashboard');
    }
  }

  return (
    <ChatContext.Provider value={{
      socket, 
      activeChat,
      messages,
      isTyping,
      connectSocket,
      sendMessage,
      startChat,
      endChat,
      setIsTyping,
      setMessages,
      typingStatus,
      setActiveChat,
      isOnline,
      isMatching,
      setIsMatching,
      chat,
      setChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}
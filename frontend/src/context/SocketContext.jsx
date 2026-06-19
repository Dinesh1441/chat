import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { setUser, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [partner, setPartner] = useState(null);
  const socketRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Initialize socket connection
    const socket = io(backendUrl, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      setSocketId(socket.id);
       socketRef.current.emit('UpdateSocketId', { 
        socketId: socket.id, userId : user?._id 
      });

    });

    

    socket.on('connected', (data) => {
      console.log('Server confirmation:', data);
    });

    socket.on('users-online', (users) => {
      console.log('Online users:', users);
      setOnlineUsers(users);
    });

    socket.on('chat-matched', (data) => {
      console.log('Matched with:', data);
      setPartner(data.partner);
      setCurrentRoom(data.roomId);
    });

    socket.on('receive-message', (message) => {
      console.log('New message:', message);
      // You can trigger a custom event that other components can listen to
      window.dispatchEvent(new CustomEvent('new-message', { detail: message }));
    });

    socket.on('user-typing', (data) => {
      window.dispatchEvent(new CustomEvent('user-typing', { detail: data }));
    });

    socket.on('chat-ended', (data) => {
      console.log('Chat ended:', data);
      setCurrentRoom(null);
      setPartner(null);
      window.dispatchEvent(new CustomEvent('chat-ended', { detail: data }));
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
      setSocketId(null);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [setUser, user]);

  // Socket event emitters
  const startChat = (userData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('start-chat', userData);
      return true;
    }
    return false;
  };

  const stopChat = () => {
    if (socketRef.current && currentRoom) {
      socketRef.current.emit('stop-chat', { roomId: currentRoom });
      setCurrentRoom(null);
      setPartner(null);
      return true;
    }
    return false;
  };

  const sendMessage = (message, roomId) => {
    if (socketRef.current && isConnected && roomId) {
      socketRef.current.emit('send-message', {
        message,
        roomId,
        timestamp: new Date()
      });
      return true;
    }
    return false;
  };

  const sendTyping = (isTyping, roomId) => {
    if (socketRef.current && isConnected && roomId) {
      socketRef.current.emit('typing', { isTyping, roomId });
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-room', roomId);
      setCurrentRoom(roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-room', roomId);
      setCurrentRoom(null);
      setPartner(null);
    }
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    socketId,
    onlineUsers,
    currentRoom,
    partner,
    startChat,
    stopChat,
    sendMessage,
    sendTyping,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
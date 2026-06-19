import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Smile, 
  Paperclip, 
  Image, 
  Mic, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Shield,
  Ellipsis,
  Flag,
  Volume2,
  VolumeX,
  MessageCircle,
  X,
  Upload,
  FileImage,
  Trash2,
  Heart,
  Laugh,
  Angry,
  Frown,
  ThumbsUp
} from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import userIcon from '../assets/user.webp'
import { use } from 'react'
import { useTheme } from '../context/ThemeContext'


// Categorized Emoji Picker Component
const EmojiPicker = ({ onEmojiSelect, onClose }) => {
   const { isMobile } = useTheme()
  const [activeCategory, setActiveCategory] = useState('smileys');

  const emojiCategories = {
    smileys: {
      name: 'Smileys',
      icon: '😊',
      emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
    },
    hearts: {
      name: 'Hearts',
      icon: '❤️',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌', '💋']
    },
    gestures: {
      name: 'Gestures',
      icon: '👋',
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👄', '🫦', '👁️', '👀', '🧠', '🫀', '🫁', '👅', '👄']
    },
    animals: {
      name: 'Animals',
      icon: '🐶',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🐟', '🐠', '🐡', '🐙', '🦑', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐅', '🐆', '🐎', '🐫']
    },
    food: {
      name: 'Food',
      icon: '🍕',
      emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🧂', '🥤']
    },
    activities: {
      name: 'Activities',
      icon: '⚽',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️']
    }
  };

  const categories = [
    { id: 'smileys', name: 'Smileys', icon: '😊' },
    { id: 'hearts', name: 'Hearts', icon: '❤️' },
    { id: 'gestures', name: 'Gestures', icon: '👋' },
    { id: 'animals', name: 'Animals', icon: '🐶' },
    { id: 'food', name: 'Food', icon: '🍕' },
    { id: 'activities', name: 'Activities', icon: '⚽' }
  ];

  return (
    <div className={"absolute bottom-full mb-2 bg-[var(--bg-primary)]  border border-[var(--border-color)] rounded-lg shadow-xl z-50 w-96 " + (isMobile ? 'left-1/2  transform -translate-x-3/10 ' : '')}>
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-[var(--border-color)]">
        <span className="text-sm font-semibold">Emojis</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
          <X size={16} />
        </button>
      </div>
      
      {/* Categories */}
      <div className="flex border-b border-[var(--border-color)] overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors whitespace-nowrap ${
              activeCategory === category.id
                ? 'border-b-2 border-accent-purple text-accent-purple'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="hidden sm:inline">{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Emojis Grid */}
      <div className="grid grid-cols-8 gap-1 p-3 max-h-80 overflow-y-auto">
        {emojiCategories[activeCategory]?.emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="text-2xl p-2 hover:bg-white/10 rounded transition-colors"
            title={emoji}
          >
            {emoji}
          </button> 
        ))}
      </div>
    </div>
  );
};

// Image Preview Component (Single Image)
const ImagePreview = ({ image, onRemove, onSend, isUploading }) => {
  return (
    <div className="relative inline-block">
      <div className="relative">
        <img 
          src={image.preview} 
          alt="Preview" 
          className="w-24 h-24 object-cover rounded-lg border-2 border-accent-purple"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(image.id)}
        disabled={isUploading}
        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        <X size={12} />
      </button>
    </div>
  );
};

const Chat = () => {
  const { activeChat, messages, setMessages, sendMessage, endChat, setActiveChat, isTyping, typingStatus, chat, setChat,
  startChat, isMatching, setIsMatching

  } = useChat()
  const { user } = useAuth()

  const { isMobile } = useTheme()

  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const emojiButtonRef = useRef(null)
  
  const [isMuted, setIsMuted] = useState(false)
  const { chatId } = useParams(); 
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const typingTimeoutRef = useRef(null);
  
  useEffect(() => {
    if( !chatId ){
      navigate('/dashboard');
    }
  }, [chatId, navigate]);

  useEffect(() => {
    if(chatId){
      const chatsRes = axios.post(`${backendUrl}/api/messages/all`, { chatId }, {
        withCredentials: true
      });
      
      chatsRes.then((res) => {
        if(res.data.success){
          // console.log(res.data.messages);
          setMessages(res.data.messages);
        }
      });

      const partnerRes = axios.post(`${backendUrl}/api/chat/partner`, { chatId }, {
        withCredentials: true
      });
      
      partnerRes.then((res) => {
        if(res.data.success){
          setActiveChat(res.data.user);
        }
      });
    }
  }, [chatId]);

  useEffect(() => {
    if(chatId){
      const chatRes = axios.post(`${backendUrl}/api/chat/get`, { chatId }, {
        withCredentials: true
      });

      chatRes.then((res) => {
        if(res.data.success){
          setChat(res.data.chat);
          // console.log('chat:', chat);
        }
      });
    }
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle single image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Remove previous image if exists
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    
    setSelectedImage({
      id: Date.now(),
      file: file,
      preview: URL.createObjectURL(file)
    });
  }

  // Remove selected image
  const removeSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Upload single image to server
  const uploadImage = async (imageFile) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await axios.post(`${backendUrl}/api/chat/upload-image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  // Send message with image
  const handleSend = async () => {
    if ((!message.trim() && !selectedImage)) {
      return;
    }
    
    if(chat?.status === 'active'){
      // Upload image if exists
      if (selectedImage) {
        const imageUrl = await uploadImage(selectedImage.file);
        if (imageUrl) {
          sendMessage(imageUrl, 'image', chatId);
        }
        removeSelectedImage();
      }
      
      // Send text message if exists
      if (message.trim()) {
        sendMessage(message, 'text', chatId);
      }
      
      setMessage('');
    } else {
      const { startChat } = useChat();
      startChat();
      setMessage('');
    }
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Handle typing start
  const handleTypingStart = useCallback(() => {
    typingStatus(true, chatId);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1500);
  }, [typingStatus, chatId]);

  // Handle typing stop
  const handleTypingStop = useCallback(() => {
    typingStatus(false, chatId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [typingStatus, chatId]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);

    if (newValue.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    } 
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup image preview on unmount
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const SkipChat = async () => {
    try{
      await endChat(chatId);
    }catch{

    }
  }

   const findMatch = async () => {

    setIsMatching(true);
    toast.loading('Finding your perfect match...', { id: 'matching' });
    
    setIsMatching(false);
    const response = await startChat(); // Simulate backend matching logic
    
  };

  useEffect(() => {
    
  }, [navigate])

  return (
    <div className="flex md:h-[calc(100vh-120px)] h-[calc(100vh-52px)] gap-4">
      {/* Chat Main Area */}
      <Card className="!p-2 md:!p-6 flex-1  rounded-none md:rounded-lg   flex flex-col overflow-hidden ">
        {/* Chat Header */}
        <div className="pb-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={activeChat?.profileImage || userIcon} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="font-semibold">{activeChat?.name}</h3>

              {isTyping}
              <p className="text-xs text-[var(--text-secondary)]"> {isTyping ? 'Typing...' : activeChat?.isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
              <div className="flex flex-wrap gap-2 ">
              {activeChat?.interests?.map(interest => (
                <span key={interest} className="px-2 py-1 text-xs rounded-full glass">
                  {interest}
                </span>
              ))}
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.senderId === user._id ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl p-3 ${
                      msg.senderId === user._id
                        ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                        : 'glass'
                    }`}
                  >
                    {msg.contentType === 'image' ? (
                      <img 
                        src={`${backendUrl}/${msg.content}`} 
                        alt="Shared" 
                        className="max-w-full max-h-64 rounded-lg cursor-pointer object-cover"
                        onClick={() => window.open(`${backendUrl}/${msg.content}`, '_blank')}
                      />
                    ) : (
                      <p className="text-sm break-words">{msg.content}</p>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full border animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full border animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full border animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview Area (Single Image) */}
        {selectedImage && (
          <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-color)]">
            <div className="flex items-center gap-3">
              <ImagePreview 
                image={selectedImage}
                onRemove={removeSelectedImage}
                isUploading={isUploading}
              />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">
                  {selectedImage.file.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {(selectedImage.file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="pt-4 border-t border-[var(--border-color)]">
          <div className="flex gap-1 md:gap-2 items-end relative box-border">
            { chat?.status === 'active' ? 
              <div className="flex gap-1 items-center">
                <Button
                  onClick={() => {
                    SkipChat();
                  }}
                  icon={isMobile ? '' : MessageCircle}
                  className="px-2 md:px-4 py-2 text-white flex gap-1 items-center border border-[var(--border-color)] bg-red-600 rounded h-full"
                >
                  Skip
                </Button>
                
               
              </div>
            : 
              <Button
                onClick={findMatch}
                icon={ isMobile ? '' : MessageCircle}
                
                className="px-2 py-2 flex gap-1 items-center text-white border border-[var(--border-color)] bg-green-600 rounded h-full"
              >
                Start
              </Button>
            }


            <div className="flex items-center   gap-1 max-w-full md:gap-2 flex-1 rounded-lg glass border-1 !border-[var(--border-color)] shadow-lg">
               {/* Single Image Upload Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                  title="Upload Image (Max 5MB)"
                  disabled={isUploading || chat?.status == 'inactive'}
                >
              
                  <Image size={18} />
                </button>
                
                {/* Emoji Picker Button */}
                <div className="relative" ref={emojiButtonRef}>
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Add Emoji"
                    disabled={chat?.status == 'inactive'}
                  >
                    <Smile size={18} />
                  </button>
                  {showEmojiPicker && (
                    <EmojiPicker 
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                </div>

                {/* Hidden file input for single image */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden "
                />

                  <textarea
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={chat?.status !== 'active'}
              placeholder={selectedImage ? "Add caption (optional)..." : "Type a message..."}
              className="flex-1 px-4 py-2 w-full  bg-transparent resize-none focus:outline-none focus:border-accent-purple"
              rows="1"
            />
              <Button
              onClick={handleSend}
              icon={isUploading ? Ellipsis : Send}
              disabled={(!message.trim() && !selectedImage) || isUploading}
              className={`${chat?.status === 'active' ? '' : 'hidden'} px-4 py-2 flex gap-1 items-center   rounded h-full`}
            >
              {/* {isUploading ? 'Uploading...' : 'Send'}  */}
            </Button>
            </div>
            
          
            
            
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Chat
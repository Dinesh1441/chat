// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Plus,
  X,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Users,
  Hash,
  Filter,
  Check,
  Rocket,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRef } from 'react';


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser, updateUserInterests , updateGenderPreference} = useAuth();
  const { startChat, isMatching, setIsMatching} = useChat();
  const [interests, setInterests] = useState(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [genderFilter, setGenderFilter] = useState(user?.genderPreference || 'both');
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  const genderOptions = [
    { value: 'male', label: 'Male', icon: '♂' },
    { value: 'both', label: 'Everyone', icon: '⚥' },
    { value: 'female', label: '  Female', icon: '♀' },
    
  ];

  const popularInterests = ['Gaming', 'Music', 'Movies', 'Tech', 'Sports', 'Art', 'Books', 'Travel'];

  const addInterest = (interest) => {
    if (!interests.includes(interest) && interests.length < 5) {
      const newInterests = [...interests, interest];
      setInterests(newInterests);
      updateUserInterests({ interests: newInterests });
      // toast.success(`✨ ${interest} added to your interests`);
    } else if (interests.length >= 5) {
      toast.error("You can add up to 5 interests only");
    }
  };

  const updateGenderFilter = (gender) => {
    updateGenderPreference(gender);
  };

  useEffect(() => {
    if(genderFilter !== user?.genderPreference){
    updateGenderFilter(genderFilter);
    }
  }, [genderFilter]);

  useEffect(() => {
    setGenderFilter(user?.genderPreference || 'both');
  }, [user]);  

  const removeInterest = (interest) => {
    const newInterests = interests.filter(i => i !== interest);
    setInterests(newInterests);
    updateUserInterests({ interests: newInterests });
    // toast.success(`Removed ${interest}`);
  };

  const findMatch = async () => {

    setIsMatching(true);
    toast.loading('Finding your perfect match...', { id: 'matching' });
    
    setIsMatching(false);
    const response = await startChat(); // Simulate backend matching logic
    
  };

  return (
    <div className="md:min-h-[86dvh] min-h-[90vh] flex items-end justify-center sm:p-0 md:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* Single Main Card */}
        <Card className="relative !p-3 md:!p-4 overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-900 to-blue-950/40 border-indigo-500/20 shadow-2xl ">
          {/* Animated Background Effects */}
          {/* <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div> */}
          
          <div className="relative z-10  md:p-8 md:p-10">
      

            {/* Main Content Grid */}
            <div className="space-y-5">
                {/* Interests Section with Dropdown */}
                <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => setIsInterestsOpen(!isInterestsOpen)}
                    className="w-full flex items-center justify-between p-3  hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-semibold text-[var(--text-primary)]">Your Interests</h3>
                      <span className="text-xs text-gray-400 ml-2">{interests.length}/5</span>
                    </div>
                    {isInterestsOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isInterestsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5  border-t border-white/10 ">
                          {/* Selected Interests */}
                          <div className="flex flex-wrap gap-2 mb-5 min-h-[30px]">
                            <AnimatePresence>
                              {interests.map((interest) => (
                                <motion.span
                                  key={interest}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  className="group flex bg-[var(--bg-secondary)] items-center gap-1.5 px-3 py-1  border border-indigo-500/40 rounded-full text-xs text-[var(--text-primary)]"
                                >
                                  <Hash className="w-3 h-3 text-indigo-300" />
                                  {interest}
                                  <button
                                    onClick={() => removeInterest(interest)}
                                    className="ml-1 p-0.5  hover:bg-indigo-500/30 rounded-full transition-colors"
                                  >
                                    <X className="w-3 h-3 text-gray-300 hover:text-white" />
                                  </button>
                                </motion.span>
                              ))}
                            </AnimatePresence>
                            {interests.length === 0 && (
                              <p className="text-gray-400 text-sm italic text-[var(--text-primary)]">No interests added yet. Click on popular ones below ✨</p>
                            )}
                          </div>

                          {/* Popular Interests */}
                          <div className="mb-5">
                            <p className="text-xs text-[var(--text-primary)] mb-3 uppercase  tracking-wide flex items-center gap-1">
                              <Star className="w-3 h-3 " /> Popular Interests
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {popularInterests.map((interest) => (
                                <button
                                  key={interest}
                                  onClick={() => addInterest(interest)}
                                  disabled={interests.includes(interest)}
                                  className={`px-3 py-1 rounded-full text-sm  transition-all ${
                                    interests.includes(interest)
                                      ? 'bg-gray-700/50 text-gray-600 cursor-not-allowed'
                                      : 'bg-white/10 text-[var(--text-primary)] hover:bg-indigo-600/40 hover:scale-105 hover:text-white'
                                  }`}
                                >
                                  {interests.includes(interest) ? <Check className="w-3 h-3 inline mr-1" /> : <Plus className="w-3 h-3 inline mr-1" />}
                                  {interest}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Interest Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && newInterest.trim()) {
                                  addInterest(newInterest.trim());
                                  setNewInterest('');
                                }
                              }}
                              placeholder="Add custom interest..."
                              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                if (newInterest.trim()) {
                                  addInterest(newInterest.trim());
                                  setNewInterest('');
                                }
                              }}
                              disabled={!newInterest.trim()}
                              className="bg-indigo-600 text-white hover:bg-indigo-700 p-y-2 px-4 text-sm rounded-lg "
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 mb-4 px-3">
                    <Filter className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Gender Preference</h3>
                  </div>
                  <div className="flex gap-2 text-sm items-center justify-center">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGenderFilter(option.value)}
                        className={`px-3 py-2 max-w-[100px] min-w-[100px] rounded-lg border border-[var(--border-color)] capitalize transition-all ${
                          genderFilter === option.value
                            ? 'bg-yellow-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                      <span className="block text-2xl">{option.icon}</span> {option.label}
                      </button>
                    ))}
                  </div>

              <Button
                    size="lg"
                    icon={MessageCircle}
                    onClick={findMatch}
                    isLoading={isMatching}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 text-white px-8 py-3 text-lg flex items-center gap-2 rounded-lg shadow-lg transition-all m-auto"
                  >
                    {isMatching ? 'Finding Match...' : 'Start Text Chat'}
                  </Button>

              {/* Right Section - Interests & Filters */}
            
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
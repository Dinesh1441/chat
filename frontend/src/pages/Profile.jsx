// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, X, Globe, Lock, Users } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser, updateUserInterests } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || 'Anonymous chatter exploring new connections',
    interests: user?.interests || [],
    privacy: user?.privacy || 'public'
  })


  useEffect(() => {
    console.log("changed")
    setFormData({
      name: user?.name || '',
      bio: user?.bio || 'Anonymous chatter exploring new connections',
      interests: user?.interests || [],
      privacy: user?.privacy || 'public'
    })
  } , [user, updateUserInterests])

  const [newInterest, setNewInterest] = useState('')

  const addInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  return (
    <div className=" mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-accent-purple to-accent-pink"></div>
        
        <div className="relative pt-20 pb-6 px-6 text-center">
          <div className="relative inline-block">
            <Users className="  w-20 h-20 p-3 rounded-full border-3 border-[var(--bg-primary)]" />
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 hidden  h-24 rounded-full border-4 border-[var(--bg-primary)]"
            />
            <button className="absolute hidden bottom-0 right-0 p-1.5 rounded-full glass border border-[var(--border-color)]">
              <Camera size={14} />
            </button>
          </div>
          
          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold mt-4 capitalize">{formData.name}</h2>
              <p className="text-[var(--text-secondary)] mt-2">{formData.bio}</p>
              <Button
                onClick={() => setIsEditing(true)}
                icon={Edit2}
                variant="secondary"
                size="sm"
                className="mt-4 flex items-center justify-center mx-auto gap-2"
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <div className="mt-4 space-y-4 text-left">
              <Input
                label="Display Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="hidden" >
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass border border-[var(--border-color)] resize-none"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} icon={Save}>Save Changes</Button>
                <Button onClick={() => setIsEditing(false)} variant="ghost">Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Interests Section */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Your Interests</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.interests.map(interest => (
            <span key={interest} className="px-3 py-1.5 rounded-full glass border border-accent-purple/30 text-sm flex items-center gap-2">
              {interest}
              {isEditing && (
                <button onClick={() => removeInterest(interest)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
          {formData.interests.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">No interests added yet</p>
          )}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 ">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add interest..."
              className="flex-1 px-3 py-2 rounded-lg glass border border-[var(--border-color)]"
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
            />
            <Button onClick={addInterest} size="sm">Add</Button>
          </div>
        )}
      </Card>

      {/* Privacy Settings */}
      <Card className='hidden'>
        <h3 className="text-lg font-semibold mb-4">Privacy & Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative w-12 h-6 rounded-full bg-accent-purple transition-colors"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Online Status</p>
              <p className="text-sm text-[var(--text-secondary)]">Show when you're active</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-green-500 transition-colors">
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Anonymous Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Hide your identity in chats</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-accent-purple transition-colors">
              <div className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
            </button>
          </div>
        </div>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4 hidden">
        <Card className="text-center p-4">
          <Globe size={20} className="mx-auto mb-2 text-accent-purple" />
          <div className="text-2xl font-bold">127</div>
          <div className="text-xs text-[var(--text-secondary)]">Chats Started</div>
        </Card>
        <Card className="text-center p-4">
          <Users size={20} className="mx-auto mb-2 text-accent-pink" />
          <div className="text-2xl font-bold">45</div>
          <div className="text-xs text-[var(--text-secondary)]">Connections</div>
        </Card>
        <Card className="text-center p-4">
          <Lock size={20} className="mx-auto mb-2 text-accent-indigo" />
          <div className="text-2xl font-bold">100%</div>
          <div className="text-xs text-[var(--text-secondary)]">Anonymous</div>
        </Card>
      </div>
    </div>
  )
}

export default Profile
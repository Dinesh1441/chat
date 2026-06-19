// src/pages/Settings.jsx
import React, { useState } from 'react'
import { Bell, Globe, Shield, Volume2, Eye, Trash2, Save } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    notifications: {
      messages: true,
      matches: true,
      sounds: false
    },
    privacy: {
      showOnline: true,
      allowMessages: true,
      shareInterests: true
    },
    language: 'en'
  })

  const updateSetting = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    })
  }

  const saveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion would be handled here')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-accent-purple" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Messages</p>
              <p className="text-sm text-[var(--text-secondary)]">Get notified when you receive a message</p>
            </div>
            <button
              onClick={() => updateSetting('notifications', 'messages', !settings.notifications.messages)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.messages ? 'bg-accent-purple' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications.messages ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Match Found</p>
              <p className="text-sm text-[var(--text-secondary)]">Alert when you find a new match</p>
            </div>
            <button
              onClick={() => updateSetting('notifications', 'matches', !settings.notifications.matches)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.matches ? 'bg-accent-purple' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications.matches ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-[var(--text-secondary)]">Play sounds for notifications</p>
            </div>
            <button
              onClick={() => updateSetting('notifications', 'sounds', !settings.notifications.sounds)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications.sounds ? 'bg-accent-purple' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications.sounds ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-accent-pink" />
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Online Status</p>
              <p className="text-sm text-[var(--text-secondary)]">Let others see when you're online</p>
            </div>
            <button
              onClick={() => updateSetting('privacy', 'showOnline', !settings.privacy.showOnline)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.showOnline ? 'bg-accent-purple' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.privacy.showOnline ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Allow Messages from Strangers</p>
              <p className="text-sm text-[var(--text-secondary)]">Control who can message you</p>
            </div>
            <button
              onClick={() => updateSetting('privacy', 'allowMessages', !settings.privacy.allowMessages)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.privacy.allowMessages ? 'bg-accent-purple' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.privacy.allowMessages ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Globe size={24} className="text-accent-indigo" />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Language</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-[var(--border-color)]"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Trash2 size={24} className="text-red-500" />
          <h2 className="text-xl font-semibold">Danger Zone</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button onClick={deleteAccount} variant="danger" icon={Trash2}>
            Delete Account
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} icon={Save} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings
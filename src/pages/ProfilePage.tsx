import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

interface Profile {
  id: string
  email: string
  name: string
  surname: string
  contact_number: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      navigate('/login')
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile({ ...profileData, email: profileData.email || user.email || '' })
      setName(profileData.name || '')
      setSurname(profileData.surname || '')
      // Load avatar from local storage since it's not in DB
      const localAvatar = localStorage.getItem('admin_avatar_url')
      setAvatarUrl(localAvatar || '')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    // Save avatar locally
    if (avatarUrl) {
      localStorage.setItem('admin_avatar_url', avatarUrl)
    } else {
      localStorage.removeItem('admin_avatar_url')
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name,
        surname: surname
      })
      .eq('id', profile.id)

    if (error) {
      alert('Error updating profile: ' + error.message)
    } else {
      alert('Profile updated successfully')
      await fetchProfile()
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const displayName = `${name} ${surname}`.trim() || 'Admin User'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-8 text-gray-700 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <span className="material-icons">arrow_back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-icons text-white text-4xl">person</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
              <p className="text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-black text-white rounded-full text-xs font-bold uppercase">
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surname</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Enter your surname"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar URL (Local)</label>
              <input
                type="url"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed"
                value={profile?.email || ''}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
              <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed"
                value={profile?.contact_number || ''}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
              <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                disabled
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-gray-500/30 transition-all disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <span className="material-icons text-sm">logout</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

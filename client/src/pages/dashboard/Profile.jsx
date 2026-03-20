import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/auth/update-profile', profile)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.message || 'Update failed') }
    finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return }
    setPassLoading(true)
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed!')
    } catch (err) { toast.error(err.message || 'Change failed') }
    finally { setPassLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>👤 Personal Information</h3>
        <form onSubmit={handleProfileUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className="form-input" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Phone</label>
              <input type="tel" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} className="form-input" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={user?.email} disabled className="form-input" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '10px 24px' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🔒 Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
              <input type="password" value={passwords[key]} onChange={(e) => setPasswords(p => ({ ...p, [key]: e.target.value }))} className="form-input" required minLength={6} />
            </div>
          ))}
          <button type="submit" disabled={passLoading} className="btn-primary" style={{ padding: '10px 24px' }}>
            {passLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile

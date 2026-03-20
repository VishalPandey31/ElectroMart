import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) { toast.error(err.message || 'Reset failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12, textAlign: 'center' }}>🔒</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>New Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} className="form-input" required minLength={6} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))} className="form-input" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword

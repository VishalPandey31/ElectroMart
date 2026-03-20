import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset email sent!')
    } catch (err) { toast.error(err.message || 'Failed to send email') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card fade-in" style={{ width: '100%', maxWidth: 420, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{sent ? '📧' : '🔑'}</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{sent ? 'Check Your Email' : 'Forgot Password'}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
          {sent ? `We sent a reset link to ${email}. Check your inbox.` : "Enter your email and we'll send you a reset link."}
        </p>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required style={{ marginBottom: 16, textAlign: 'left' }} />
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <button onClick={() => setSent(false)} className="btn-secondary" style={{ width: '100%', padding: '12px' }}>Try Again</button>
        )}
        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          <Link to="/login" style={{ color: 'var(--accent-light)' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword

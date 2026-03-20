import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) { toast.error(err.message || 'Login failed') }
    finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', background: '#0d1525', border: '1.5px solid #2d3748',
    borderRadius: 8, padding: '12px 14px', color: '#e8eef5',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'stretch',
      background: '#080b14',
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: '0 0 40%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #0d2040 0%, #0a1628 40%, #12082a 100%)',
        padding: '60px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(40,116,240,0.12)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(137,87,229,0.1)', filter: 'blur(50px)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #2874f0, #1a5dd4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, margin: '0 auto 20px',
            boxShadow: '0 8px 28px rgba(40,116,240,0.4)',
          }}>⚡</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#e8eef5', marginBottom: 10, letterSpacing: '-0.5px' }}>ElectroMart</h2>
          <p style={{ fontSize: 15, color: '#8b9ab5', lineHeight: 1.7, maxWidth: 280, margin: '0 auto 40px' }}>
            India's most trusted electronics store for Arduino, ESP32, sensors & robotics kits.
          </p>

          {/* Trust points */}
          {[
            '🚚 Free delivery on orders above ₹999',
            '🔒 100% secure payments via Razorpay',
            '↩️ Easy 7-day returns & refunds',
            '✅ Genuine & authentic components',
          ].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, textAlign: 'left' }}>
              <div style={{ fontSize: 13.5, color: '#8b9ab5', lineHeight: 1.5 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px',
      }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#e8eef5', marginBottom: 8, letterSpacing: '-0.4px' }}>
              Welcome back 👋
            </h1>
            <p style={{ color: '#6e7681', fontSize: 14.5 }}>Sign in to your account to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#8b9ab5', marginBottom: 7 }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                required
                autoFocus
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2874f0'}
                onBlur={e => e.target.style.borderColor = '#2d3748'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#8b9ab5' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12.5, color: '#4da8ff', fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#2874f0'}
                  onBlur={e => e.target.style.borderColor = '#2d3748'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 16, padding: 2 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', fontSize: 15.5, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#1a3a7a' : 'linear-gradient(135deg, #2874f0, #1a5dd4)',
                color: '#fff', border: 'none', borderRadius: 8, marginTop: 22,
                boxShadow: '0 4px 16px rgba(40,116,240,0.3)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.1)' }}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
              {loading ? (
                <><span className="spin" style={{ display: 'inline-block', fontSize: 16 }}>⟳</span> Signing in...</>
              ) : '🔑 Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: 20, padding: '12px 16px',
            background: 'rgba(40,116,240,0.06)', border: '1px solid rgba(40,116,240,0.15)',
            borderRadius: 8, fontSize: 12.5, color: '#8b9ab5',
          }}>
            <strong style={{ color: '#4da8ff' }}>Demo Admin:</strong> admin@electromart.in / Admin@123
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6e7681', marginTop: 24 }}>
            New to ElectroMart?{' '}
            <Link to="/signup" style={{ color: '#4da8ff', fontWeight: 700 }}>Create account →</Link>
          </p>

          {/* Social divider placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#1e2530' }} />
            <span style={{ fontSize: 12, color: '#4d5562', fontWeight: 600 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: '#1e2530' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ icon: '🇬', label: 'Google' }, { icon: '📧', label: 'OTP Login' }].map(s => (
              <button key={s.label}
                style={{ padding: '10px', background: '#0d1525', border: '1.5px solid #2d3748', borderRadius: 8, color: '#c9d1d9', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4da8ff'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3748'}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

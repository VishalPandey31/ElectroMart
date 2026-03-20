import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Signup = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [step, setStep] = useState(1) // 2-step form

  const getPasswordStrength = (p) => {
    if (!p) return { label: '', color: '', pct: 0 }
    if (p.length < 6) return { label: 'Too short', color: '#f85149', pct: 15 }
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(p)) return { label: 'Weak', color: '#ffa41c', pct: 40 }
    if (p.length >= 10 && /(?=.*[!@#$%^&*])/.test(p)) return { label: 'Strong', color: '#3fb950', pct: 100 }
    if (p.length >= 8) return { label: 'Good', color: '#56d364', pct: 75 }
    return { label: 'Fair', color: '#ffa41c', pct: 55 }
  }
  const strength = getPasswordStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (!agreed) { toast.error('Please accept the terms to continue'); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      navigate('/')
    } catch (err) { toast.error(err.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', background: '#0d1525', border: '1.5px solid #2d3748',
    borderRadius: 8, padding: '12px 14px', color: '#e8eef5',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
  }

  const onFocus = e => e.target.style.borderColor = '#2874f0'
  const onBlur = e => e.target.style.borderColor = '#2d3748'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080b14' }}>
      {/* Left decorative */}
      <div style={{
        flex: '0 0 40%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #0a1628 0%, #12082a 60%, #0d2040 100%)',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '15%', right: '-5%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(137,87,229,0.12)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(40,116,240,0.1)', filter: 'blur(50px)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #8957e5, #6e3dc6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, margin: '0 auto 20px', boxShadow: '0 8px 28px rgba(137,87,229,0.4)',
          }}>🚀</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#e8eef5', marginBottom: 10 }}>Join ElectroMart</h2>
          <p style={{ fontSize: 14.5, color: '#8b9ab5', lineHeight: 1.7, maxWidth: 280, margin: '0 auto 36px' }}>
            Join 50,000+ makers, students & engineers building amazing projects.
          </p>

          {/* Benefits */}
          {[
            { icon: '🎁', title: '₹100 Welcome Coupon', desc: 'On your first order' },
            { icon: '⚡', title: 'Early Access Deals', desc: 'Get deals before anyone' },
            { icon: '📦', title: 'Order Tracking', desc: 'Real-time order updates' },
            { icon: '❤️', title: 'Save to Wishlist', desc: 'Track your favourite items' },
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#c9d1d9' }}>{b.title}</div>
                <div style={{ fontSize: 12, color: '#6e7681' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#e8eef5', marginBottom: 8, letterSpacing: '-0.4px' }}>
              Create your account ✨
            </h1>
            <p style={{ color: '#6e7681', fontSize: 14 }}>It's free and only takes a minute</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name + Phone row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#8b9ab5', marginBottom: 6 }}>Full Name *</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe" required
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#8b9ab5', marginBottom: 6 }}>Phone</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#8b9ab5', marginBottom: 6 }}>Email Address *</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com" required autoComplete="email"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#8b9ab5', marginBottom: 6 }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters" required autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: 44 }} onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 5, background: '#1e2530', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${strength.pct}%`, height: '100%', background: strength.color, borderRadius: 3, transition: 'all 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: strength.color, fontWeight: 700, minWidth: 52 }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#8b9ab5', marginBottom: 6 }}>Confirm Password *</label>
              <input
                type="password" value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat your password" required autoComplete="new-password"
                style={{ ...inputStyle, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#f85149' : '#2d3748' }}
                onFocus={onFocus} onBlur={onBlur}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ color: '#f85149', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ✗ Passwords do not match
                </p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password && (
                <p style={{ color: '#3fb950', fontSize: 12, marginTop: 5 }}>✓ Passwords match</p>
              )}
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 22 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ accentColor: '#2874f0', width: 15, height: 15, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: '#8b9ab5', lineHeight: 1.6 }}>
                I agree to the{' '}
                <Link to="#" style={{ color: '#4da8ff', fontWeight: 600 }}>Terms of Service</Link>{' '}
                and{' '}
                <Link to="#" style={{ color: '#4da8ff', fontWeight: 600 }}>Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading || !agreed}
              style={{
                width: '100%', padding: '13px', fontSize: 15.5, fontWeight: 800,
                cursor: loading || !agreed ? 'not-allowed' : 'pointer',
                background: !agreed ? '#1a1a2e' : 'linear-gradient(135deg, #8957e5, #6e3dc6)',
                color: !agreed ? '#4d5562' : '#fff',
                border: !agreed ? '1.5px solid #2d3748' : 'none',
                borderRadius: 8,
                boxShadow: agreed ? '0 4px 16px rgba(137,87,229,0.3)' : 'none',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {loading ? (
                <><span className="spin" style={{ display: 'inline-block' }}>⟳</span> Creating Account...</>
              ) : '✨ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6e7681', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4da8ff', fontWeight: 700 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

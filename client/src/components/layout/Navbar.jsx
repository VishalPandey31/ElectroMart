import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

const OFFERS = [
  '🎉 Get 10% off on your first order | Use code: ELECTRO10',
  '🚚 FREE Delivery on orders above ₹999',
  '⚡ New Arduino Uno R4 arrived! Limited stock',
  '📦 Express delivery in 24 hours available',
  '💳 0% EMI on orders above ₹2999',
]

const CATEGORIES = [
  { name: 'Arduino',       slug: 'arduino',          icon: '🔵' },
  { name: 'ESP32 / WiFi',  slug: 'esp32-esp8266',    icon: '📡' },
  { name: 'Sensors',       slug: 'sensors',           icon: '🌡️' },
  { name: 'Modules',       slug: 'modules',           icon: '📦' },
  { name: 'Robotics Kits', slug: 'robotics-kits',     icon: '🤖' },
  { name: 'Components',    slug: 'components',        icon: '⚡' },
  { name: 'Raspberry Pi',  slug: 'raspberry-pi',     icon: '🍓' },
  { name: 'Tools',         slug: 'tools',             icon: '🔧' },
  { name: 'Displays',      slug: 'displays',          icon: '🖥️' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSugg, setShowSugg] = useState(false)
  const [offerIdx, setOfferIdx] = useState(0)
  const [showAccount, setShowAccount] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [pincode, setPincode] = useState('110001')
  const accountRef = useRef()

  // Rotate offer strip
  useEffect(() => {
    const t = setInterval(() => setOfferIdx(i => (i + 1) % OFFERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Search suggestions
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?keyword=${encodeURIComponent(query)}&limit=6`)
        setSuggestions(data.products || [])
      } catch { setSuggestions([]) }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Close account dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (accountRef.current && !accountRef.current.contains(e.target)) setShowAccount(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) { navigate(`/products?keyword=${encodeURIComponent(query.trim())}`); setShowSugg(false) }
  }

  return (
    <>
      {/* ── Offer Strip ── */}
      <div style={{ background: '#172337', height: 32, display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: '#ccc', fontWeight: 500, transition: 'opacity 0.4s' }} key={offerIdx}>
            {OFFERS[offerIdx]}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: '#aaa', flexShrink: 0 }}>
            <span>📞 8149377447</span>
            <span>|</span>
            <span>🌐 EN</span>
            <span>|</span>
            <span>Sell on ElectroMart</span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header style={{ background: '#2874f0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1.5px solid rgba(255,255,255,0.3)' }}>⚡</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>Electro<span style={{ color: '#ffd814' }}>Mart</span></div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginTop: 1 }}>
                    <span style={{ color: '#ffd814', fontWeight: 700 }}>Plus</span> ✦ Superstore
                  </div>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div style={{ flex: 1, position: 'relative', maxWidth: 640 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                <select style={{ background: '#f0f0f0', border: 'none', padding: '0 12px', color: '#333', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', borderRight: '1px solid #ddd', flexShrink: 0, height: 44 }}>
                  <option>All</option>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                <input
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setShowSugg(true) }}
                  onFocus={() => setShowSugg(true)}
                  onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                  placeholder="Search for Arduino, ESP32, Sensors, Robotics..."
                  style={{
                    flex: 1, border: 'none', padding: '0 16px', fontSize: 14,
                    color: '#111', background: '#fff', outline: 'none', height: 44,
                  }}
                />
                <button type="submit" style={{ background: '#ffd814', border: 'none', padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s', height: 44 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0c800'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffd814'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </button>
              </form>

              {/* Search suggestions dropdown */}
              {showSugg && suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 200, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  {suggestions.map(p => (
                    <div key={p._id}
                      onClick={() => { navigate(`/products/${p.slug}`); setShowSugg(false); setQuery('') }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <img src={p.images?.[0]?.url} alt="" style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 4, background: '#f9f9f9', padding: 4 }} onError={e => e.target.style.display = 'none'} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: '#212121' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#388e3c', fontWeight: 600 }}>₹{(p.discountPrice || p.price)?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div onClick={() => { navigate(`/products?keyword=${encodeURIComponent(query)}`); setShowSugg(false) }}
                    style={{ padding: '10px 16px', fontSize: 13, color: '#2874f0', fontWeight: 600, cursor: 'pointer', background: '#f9f9f9', textAlign: 'center' }}>
                    See all results for "{query}" →
                  </div>
                </div>
              )}
            </div>

            {/* Pincode */}
            <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', flexShrink: 0, cursor: 'pointer', minWidth: 80 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Deliver to</span>
              <span style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                📍{pincode}
              </span>
            </div>

            {/* Account Dropdown */}
            <div ref={accountRef} style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={() => setShowAccount(true)} onMouseLeave={() => setShowAccount(false)}>
              <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, transition: 'background 0.15s', background: showAccount ? 'rgba(255,255,255,0.1)' : 'transparent' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>
                  {user ? `Hello, ${user.name?.split(' ')[0]}` : 'Hello, Sign in'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Account & More
                  <svg width="10" height="10" viewBox="0 0 10 6" fill="white"><path d="M1 1l4 4 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                </span>
              </div>

              {showAccount && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: 260, background: '#fff', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: 300, overflow: 'hidden', border: '1px solid #e0e0e0', marginTop: 4 }} className="fade-in">
                  {!user ? (
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>New customer?</div>
                        <Link to="/signup"><span style={{ color: '#2874f0', fontWeight: 700, fontSize: 13 }}>Start here →</span></Link>
                      </div>
                      <Link to="/login" style={{ marginLeft: 'auto' }}>
                        <button style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                          Sign In
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #2874f0, #673ab7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#212121' }}>{user.name}</div>
                        <div style={{ fontSize: 11.5, color: '#888' }}>{user.email}</div>
                      </div>
                    </div>
                  )}
                  {[
                    { icon: '📦', label: 'My Orders', to: '/dashboard/orders' },
                    { icon: '👤', label: 'My Profile', to: '/dashboard/profile' },
                    { icon: '❤️', label: 'My Wishlist', to: '/dashboard/wishlist' },
                    { icon: '📍', label: 'Saved Addresses', to: '/dashboard/addresses' },
                    ...(user?.role === 'admin' ? [{ icon: '🔧', label: 'Admin Panel', to: '/admin' }] : []),
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setShowAccount(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f9f9f9', transition: 'background 0.1s', color: '#333', fontSize: 13.5 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  {user && (
                    <button onClick={() => { logout(); setShowAccount(false) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', fontSize: 13.5, fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span>🚪</span> Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/dashboard/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', flexShrink: 0, padding: '4px 8px', borderRadius: 4, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 20 }}>♡</span>
              <span style={{ fontSize: 10, marginTop: -2, fontWeight: 600 }}>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', flexShrink: 0, padding: '4px 8px', borderRadius: 4, transition: 'background 0.15s', minWidth: 70, textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -2, right: 6, background: '#ff6161', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span style={{ fontSize: 22 }}>🛒</span>
              <span style={{ fontSize: 11, fontWeight: 700, marginTop: -2, color: '#ffd814' }}>Cart</span>
            </Link>
          </div>
        </div>

        {/* ── Category Navigation Bar ── */}
        <div style={{ background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 38, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {/* All Categories */}
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 38, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
                  ☰ All
                </button>
                {showCategories && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: 660, background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 400, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #e0e0e0', borderTop: 'none' }} className="fade-in">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #f5f5f5', borderRight: '1px solid #f5f5f5', transition: 'background 0.1s', color: '#212121' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <span style={{ fontSize: 22, width: 28, textAlign: 'center' }}>{cat.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick category links */}
              {CATEGORIES.slice(0, 6).map(cat => (
                <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', height: 38, color: 'rgba(255,255,255,0.9)', fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', transition: 'background 0.15s', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
              <Link to="/smart-recommender"
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', height: 38, color: '#ffd814', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', transition: 'background 0.15s', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                🤖 AI Picks
              </Link>
              <Link to="/contact"
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', height: 38, color: 'rgba(255,255,255,0.9)', fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', transition: 'background 0.15s', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                📞 Contact
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

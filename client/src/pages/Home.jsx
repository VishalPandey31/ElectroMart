import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'
import { SkeletonCard } from '../components/ui/Loaders'

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    bg: 'linear-gradient(130deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#ffd814',
    title: 'Arduino Uno R3',
    sub: 'The world\'s #1 microcontroller for makers, students & engineers. 14 digital I/O pins, 6 analog, 16 MHz ATmega328P.',
    price: '₹649', original: '₹799', off: '19% off',
    badge: 'BESTSELLER',
    img: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg',
    link: '/products?category=arduino',
    cta: 'Shop Now',
    tags: ['Beginner Friendly', 'USB Powered', 'Open Source'],
  },
  {
    bg: 'linear-gradient(130deg, #1b2838 0%, #1e3a5f 50%, #243b55 100%)',
    accent: '#56ccf2',
    title: 'ESP32 Dev Board',
    sub: 'Dual-core 240 MHz with WiFi + BT. 520 KB SRAM. The ultimate IoT & home automation microcontroller.',
    price: '₹299', original: '₹349', off: '14% off',
    badge: '🔥 HOT',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg/640px-ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg',
    link: '/products?category=esp32-esp8266',
    cta: 'Buy Now',
    tags: ['WiFi + Bluetooth', 'Low Power', 'IoT Ready'],
  },
  {
    bg: 'linear-gradient(130deg, #1a0533 0%, #2d0b5e 50%, #4a0080 100%)',
    accent: '#f9c74f',
    title: 'Robot Starter Kit',
    sub: 'Everything you need — chassis, motors, IR sensors, motor driver & Arduino. Assemble in 2 hours!',
    price: '₹999', original: '₹1299', off: '23% off',
    badge: '⭐ TOP RATED',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    link: '/products?category=robotics-kits',
    cta: 'Explore Kits',
    tags: ['Step-by-Step Guide', 'All Parts Included', 'Learn Robotics'],
  },
]

const CATEGORIES = [
  { name: 'Arduino',       slug: 'arduino',         icon: '🔵', color: '#2874f0', bg: '#e3f2fd' },
  { name: 'ESP32/WiFi',    slug: 'esp32-esp8266',   icon: '📡', color: '#e65100', bg: '#fff3e0' },
  { name: 'Sensors',       slug: 'sensors',          icon: '🌡️', color: '#2e7d32', bg: '#e8f5e9' },
  { name: 'Modules',       slug: 'modules',          icon: '📦', color: '#5e35b1', bg: '#ede7f6' },
  { name: 'Robotics Kits', slug: 'robotics-kits',    icon: '🤖', color: '#d81b60', bg: '#fce4ec' },
  { name: 'Components',    slug: 'components',       icon: '⚡', color: '#c62828', bg: '#ffebee' },
  { name: 'Raspberry Pi',  slug: 'raspberry-pi',    icon: '🍓', color: '#ad1457', bg: '#fce4ec' },
  { name: 'Tools',         slug: 'tools',            icon: '🔧', color: '#37474f', bg: '#eceff1' },
  { name: 'Displays',      slug: 'displays',         icon: '🖥️', color: '#1565c0', bg: '#e3f2fd' },
  { name: 'Breadboards',   slug: 'components',       icon: '🔌', color: '#00796b', bg: '#e0f2f1' },
]

// ─── Deal Timer ─────────────────────────────────────────────────────────────
function DealTimer({ endSecs = 5 * 3600 + 20 * 60 }) {
  const [secs, setSecs] = useState(endSecs)
  useEffect(() => { const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000); return () => clearInterval(t) }, [])
  const h = String(Math.floor(secs / 3600)).padStart(2, '0')
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>Ends in</span>
      {[h, m, s].map((v, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ background: '#212121', color: '#fff', padding: '3px 8px', borderRadius: 3, fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
          {i < 2 && <span style={{ fontWeight: 900, color: '#c62828', fontSize: 15 }}>:</span>}
        </span>
      ))}
    </div>
  )
}

// ─── Hero Slider ─────────────────────────────────────────────────────────────
function HeroSlider() {
  const [cur, setCur] = useState(0)
  const navigate = useNavigate()
  const slide = HERO_SLIDES[cur]
  useEffect(() => { const t = setInterval(() => setCur(c => (c + 1) % HERO_SLIDES.length), 5000); return () => clearInterval(t) }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: slide.bg, transition: 'background 0.6s' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'center', padding: '44px 16px 52px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in" key={cur}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ background: slide.accent, color: '#111', fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 3, letterSpacing: 0.5 }}>{slide.badge}</span>
            {slide.tags.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}>✓ {t}</span>)}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.5px' }}>{slide.title}</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.75, maxWidth: 480 }}>{slide.sub}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{slide.price}</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>{slide.original}</span>
            <span style={{ fontSize: 14, color: slide.accent, fontWeight: 700 }}>↓ {slide.off}</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate(slide.link)}
              style={{ background: slide.accent, color: '#111', fontWeight: 800, border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 15, cursor: 'pointer', boxShadow: `0 4px 16px rgba(0,0,0,0.2)`, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
              {slide.cta} →
            </button>
            <button onClick={() => navigate('/products')}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 4, padding: '12px 24px', fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              Browse All
            </button>
          </div>
        </div>

        {/* Image */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 300, height: 300, borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 0 60px ${slide.accent}30` }}>
            <img src={slide.img} alt={slide.title} key={cur} style={{ width: '90%', height: '90%', objectFit: 'contain', padding: 16 }} onError={e => e.target.style.display = 'none'} />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{ width: i === cur ? 24 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', background: i === cur ? slide.accent : 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Arrows */}
      {[[-1, 'left', '‹'], [1, 'right', '›']].map(([dir, pos, sym]) => (
        <button key={pos} onClick={() => setCur(c => (c + dir + HERO_SLIDES.length) % HERO_SLIDES.length)}
          style={{ position: 'absolute', top: '50%', [pos]: 12, transform: 'translateY(-50%)', width: 38, height: 38, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, backdropFilter: 'blur(4px)' }}>{sym}</button>
      ))}
    </div>
  )
}

// ─── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ icon, title, sub, link, linkText = 'See All', accentColor = '#2874f0', timer }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, padding: '14px 20px', borderBottom: `3px solid ${accentColor}`, background: '#fff', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#212121', display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon} {title}
        </h2>
        {sub && <span style={{ fontSize: 13, color: '#888' }}>{sub}</span>}
        {timer && <DealTimer />}
      </div>
      {link && (
        <Link to={link} style={{ fontSize: 13.5, color: accentColor, fontWeight: 700, border: `1px solid ${accentColor}`, borderRadius: 4, padding: '6px 14px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = accentColor; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accentColor }}>
          {linkText} →
        </Link>
      )}
    </div>
  )
}

// ─── White Product Grid Wrapper ────────────────────────────────────────────────
function ProductSection({ children }) {
  return (
    <div style={{ background: '#fff', padding: '0 0 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1, background: '#f1f3f6' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/products/featured'),
      api.get('/products?sort=popular&limit=10'),
    ]).then(([f, t]) => {
      setFeatured(f.data.products || [])
      setTrending(t.data.products || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#f1f3f6' }}>
      {/* Hero */}
      <HeroSlider />

      {/* ── AI Recommender Promo Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1c2455 100%)', padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 44, animation: 'pulse 2s ease-in-out infinite alternate' }}>🤖</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>NEW: AI Smart Product Recommender</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Detects your device, platform & time of day → suggests perfect electronics for YOU!</div>
            </div>
          </div>
          <button onClick={() => navigate('/smart-recommender')}
            style={{ background: 'linear-gradient(135deg, #ffd814, #ffa000)', color: '#111', border: 'none', borderRadius: 6, padding: '12px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 0 24px rgba(255,216,20,0.4)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(255,216,20,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 24px rgba(255,216,20,0.4)' }}>
            🔍 Get My Recommendations →
          </button>
        </div>
        <style>{`@keyframes pulse{from{transform:scale(1)}to{transform:scale(1.12)}}`}</style>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', margin: '0 0 10px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
            {[
              { icon: '🚚', t: 'Free Delivery', d: 'On orders ₹999+' },
              { icon: '↩️', t: 'Easy Returns', d: '7-Day return policy' },
              { icon: '🔒', t: 'Secure Payment', d: 'Razorpay encrypted' },
              { icon: '💬', t: '24/7 Support', d: 'Expert help anytime' },
              { icon: '✅', t: '100% Genuine', d: 'Authentic products' },
            ].map((f, i) => (
              <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRight: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#212121' }}>{f.t}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content split layout (like Flipkart) */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 10, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* ── Shop by Category ── */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <SectionTitle icon="🗂️" title="Shop by Category" accentColor="#2874f0" link="/products" linkText="All Products" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: '#f1f3f6', padding: 1 }}>
              {CATEGORIES.slice(0, 10).map(cat => (
                <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '18px 8px', background: '#fff', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(40,116,240,0.15)'; e.currentTarget.style.zIndex = 1; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: cat.bg, border: `2px solid ${cat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: `0 4px 12px ${cat.color}20` }}>
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#212121', textAlign: 'center', lineHeight: 1.3 }}>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Flash Sale ── */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <SectionTitle icon="⚡" title="Flash Sale" accentColor="#ff6161" link="/products?featured=true" linkText="See All Deals" timer />
            <ProductSection>
              {loading ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />) : featured.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
            </ProductSection>
          </div>

          {/* ── Featured Products ── */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <SectionTitle icon="⭐" title="Top Picks" sub="Handpicked for you" accentColor="#2874f0" link="/products?featured=true" />
            <ProductSection>
              {loading ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />) : featured.map(p => <ProductCard key={p._id} product={p} />)}
            </ProductSection>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 110 }}>
          {/* Login Prompt */}
          <div style={{ background: '#2874f0', borderRadius: 4, padding: 20, color: '#fff' }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>New to ElectroMart?</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16, lineHeight: 1.6 }}>Sign up to get ₹100 off on your first order</div>
            <Link to="/signup">
              <button style={{ width: '100%', background: '#fff', color: '#2874f0', border: 'none', borderRadius: 4, padding: '10px', fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
                Create Account
              </button>
            </Link>
            <Link to="/login">
              <button style={{ width: '100%', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 4, padding: '9px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Top Categories Quick */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '2px solid #2874f0', fontWeight: 800, fontSize: 15, color: '#212121' }}>🏷️ Best Deals</div>
            {[
              { label: 'Arduino Boards', off: 'Up to 25% off', color: '#2874f0', link: '/products?category=arduino' },
              { label: 'ESP32 Modules', off: 'Up to 20% off', color: '#e65100', link: '/products?category=esp32-esp8266' },
              { label: 'Sensor Kits', off: 'Up to 30% off', color: '#2e7d32', link: '/products?category=sensors' },
              { label: 'Robotics Kits', off: 'Up to 35% off', color: '#d81b60', link: '/products?category=robotics-kits' },
              { label: 'Components', off: 'Up to 15% off', color: '#5e35b1', link: '/products?category=components' },
            ].map(d => (
              <Link key={d.label} to={d.link}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{d.label}</span>
                <span style={{ fontSize: 11.5, color: '#388e3c', fontWeight: 700 }}>{d.off}</span>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#212121', marginBottom: 6 }}>📧 Get Exclusive Deals</div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 12, lineHeight: 1.6 }}>Subscribe for early access to flash sales & discount codes.</p>
            {subscribed ? (
              <p style={{ color: '#388e3c', fontWeight: 700, fontSize: 13 }}>✅ Subscribed!</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); email && setSubscribed(true) }}>
                <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 4, padding: '8px 12px', fontSize: 13, outline: 'none', marginBottom: 8, fontFamily: 'inherit', color: '#333' }}
                  onFocus={e => e.target.style.borderColor = '#2874f0'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                <button type="submit" style={{ width: '100%', background: '#2874f0', color: '#fff', border: 'none', borderRadius: 4, padding: '9px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Trending Banner ── */}
      <div style={{ margin: '10px 0', background: 'linear-gradient(135deg, #c62828 0%, #8d0e0e 100%)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 40 }}>⚡</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Lightning Deals — Up to 40% Off!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Limited time. While stocks last.</div>
            </div>
          </div>
          <Link to="/products?featured=true">
            <button style={{ background: '#fff', color: '#c62828', border: 'none', borderRadius: 4, padding: '11px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Grab Deals →
            </button>
          </Link>
        </div>
      </div>

      {/* ── Trending Products ── */}
      <div className="container" style={{ paddingBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <SectionTitle icon="🔥" title="Trending Now" accentColor="#ff6161" link="/products?sort=popular" timer />
          <ProductSection>
            {loading ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />) : trending.slice(0, 10).map(p => <ProductCard key={p._id} product={p} />)}
          </ProductSection>
        </div>
      </div>

      {/* ── Promo Banners ── */}
      <div className="container" style={{ paddingBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { bg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', accent: '#1565c0', icon: '🍓', title: 'Raspberry Pi 4', sub: 'Quad-core 1.8GHz, up to 8GB RAM', link: '/products?category=raspberry-pi', cta: 'Shop Now' },
            { bg: 'linear-gradient(135deg, #ede7f6, #d1c4e9)', accent: '#4527a0', icon: '🤖', title: 'Robotics Kits', sub: 'Build your first robot today!', link: '/products?category=robotics-kits', cta: 'Explore' },
            { bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', accent: '#1b5e20', icon: '🌡️', title: 'Sensor Packs', sub: 'Temperature, IR, Ultrasonic & more', link: '/products?category=sensors', cta: 'View All' },
          ].map(b => (
            <div key={b.title}
              style={{ borderRadius: 4, background: b.bg, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}
              onClick={() => navigate(b.link)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none' }}>
              <span style={{ fontSize: 44 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: b.accent, marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>{b.sub}</div>
                <button style={{ background: b.accent, color: '#fff', border: 'none', borderRadius: 3, padding: '6px 14px', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>{b.cta} →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'
import { SkeletonCard } from '../components/ui/Loaders'

// ── Device detection ─────────────────────────────────────────────────────
function detectProfile() {
  const ua = navigator.userAgent
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
  const isTablet = /iPad|Tablet/i.test(ua)
  const isWindows = /Win/i.test(ua)
  const isMac = /Mac/i.test(ua)
  const isLinux = /Linux/i.test(ua) && !isMobile
  const isAndroid = /Android/i.test(ua)
  const isIOS = /iPhone|iPad/i.test(ua)

  const hour = new Date().getHours()
  const timeSlot = hour < 6 ? 'late-night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'

  const lang = navigator.language || 'en'
  const screen_w = window.screen.width
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  return { isMobile, isTablet, isWindows, isMac, isLinux, isAndroid, isIOS, timeSlot, lang, screen_w, deviceType, hour }
}

// ── Recommendation logic ─────────────────────────────────────────────────
function getRecommendations(profile) {
  const recs = []

  if (profile.isMobile) {
    recs.push({ category: 'esp32-esp8266', reason: '📱 Mobile user detected — ESP32 WiFi boards are perfect for IoT projects you control from your phone!', icon: '📡', title: 'WiFi & IoT Boards' })
    recs.push({ category: 'sensors', reason: '🌡️ Build sensor-based apps that send data to your mobile. Temperature, humidity and more!', icon: '🌡️', title: 'Sensor Modules' })
  } else if (profile.isWindows) {
    recs.push({ category: 'arduino', reason: '💻 Windows PC detected — Arduino is best supported on Windows with the official IDE!', icon: '🔵', title: 'Arduino Boards' })
    recs.push({ category: 'tools', reason: '🔧 Desktop power user? Get proper soldering tools and equipment for your lab.', icon: '🔧', title: 'Tools & Equipment' })
  } else if (profile.isMac) {
    recs.push({ category: 'raspberry-pi', reason: '🍎 Mac user detected — Raspberry Pi pairs perfectly with Mac for SSH & Linux projects!', icon: '🍓', title: 'Raspberry Pi' })
    recs.push({ category: 'displays', reason: '🖥️ Mac users love clean UIs — hook up beautiful OLED and TFT displays to your projects!', icon: '🖥️', title: 'Display Modules' })
  } else if (profile.isLinux) {
    recs.push({ category: 'raspberry-pi', reason: '🐧 Linux detected — you\'ll love Raspberry Pi. Two great platforms, zero limits!', icon: '🍓', title: 'Raspberry Pi' })
    recs.push({ category: 'iot-devices', reason: '⚙️ Linux expert? Take on advanced IoT with LoRa, Zigbee and RFID modules!', icon: '🌐', title: 'IoT Devices' })
  }

  if (profile.timeSlot === 'morning') {
    recs.push({ category: 'modules', reason: '☀️ Good morning! Morning makers prefer modular builds — grab relay, RTC and GPS modules!', icon: '📦', title: 'Smart Modules' })
  } else if (profile.timeSlot === 'afternoon') {
    recs.push({ category: 'components', reason: '🛒 Afternoon shopping? Stock up on essential components — resistors, caps, LEDs!', icon: '⚡', title: 'Components Kit' })
  } else if (profile.timeSlot === 'evening') {
    recs.push({ category: 'robotics-kits', reason: '🌙 Evening tinkerer! Robotics kits are perfect for after-work builds and weekend projects.', icon: '🤖', title: 'Robotics Kits' })
  } else {
    recs.push({ category: 'iot-devices', reason: '🌑 Night owl engineer! Advanced IoT modules for late-night deep-dive projects.', icon: '🌐', title: 'IoT Devices' })
  }

  // Deduplicate
  const seen = new Set()
  return recs.filter(r => { if (seen.has(r.category)) return false; seen.add(r.category); return true }).slice(0, 3)
}

const DOT = { width: 10, height: 10, borderRadius: '50%', display: 'inline-block', marginRight: 8 }

export default function SmartRecommender() {
  const [phase, setPhase] = useState('scanning') // scanning | ready
  const [profile, setProfile] = useState(null)
  const [recs, setRecs] = useState([])
  const [activeRec, setActiveRec] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const p = detectProfile()
    setProfile(p)
    const r = getRecommendations(p)
    setRecs(r)
    // Simulate scanning animation
    const t = setTimeout(() => { setPhase('ready'); fetchProducts(r[0]?.category) }, 2800)
    return () => clearTimeout(t)
  }, [])

  const fetchProducts = async (cat) => {
    if (!cat) return
    setLoading(true)
    try {
      const { data } = await api.get(`/products?category=${cat}&limit=8`)
      setProducts(data.products || [])
    } catch { setProducts([]) } finally { setLoading(false) }
  }

  const switchRec = (idx) => { setActiveRec(idx); fetchProducts(recs[idx]?.category) }

  // ── Scanning screen ──────────────────────────────────────────────────────
  if (phase === 'scanning') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 100%)', color: '#fff', padding: 32 }}>
        <div style={{ fontSize: 72, marginBottom: 24, animation: 'spin 2s linear infinite' }}>🔍</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>AI Analyzing Your Device...</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 36, textAlign: 'center', maxWidth: 400 }}>
          Detecting your platform, environment, and usage patterns to suggest the perfect electronics for you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360 }}>
          {['Detecting device type...', 'Checking time of day...', 'Analyzing platform signals...', 'Building recommendations...'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.9 }}>
              <div style={{ ...DOT, background: '#00e676', boxShadow: '0 0 8px #00e676', animation: `pulse ${0.6 + i * 0.3}s ease-in-out infinite alternate` }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{s}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{from{opacity:0.4}to{opacity:1}}`}</style>
      </div>
    )
  }

  // ── Result screen ────────────────────────────────────────────────────────
  const cur = recs[activeRec]
  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a237e 0%, #2874f0 100%)', padding: '36px 0 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 40 }}>🤖</div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: 0 }}>AI Smart Recommender</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>Personalized picks based on your device & environment</p>
            </div>
          </div>

          {/* Device Profile Card */}
          {profile && (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '16px 20px', marginTop: 20, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>🔍 Detected Profile</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  ['Device', profile.deviceType.toUpperCase()],
                  ['Platform', profile.isWindows ? 'Windows 🪟' : profile.isMac ? 'macOS 🍎' : profile.isLinux ? 'Linux 🐧' : profile.isAndroid ? 'Android 🤖' : profile.isIOS ? 'iOS 🍏' : 'Unknown'],
                  ['Time', profile.timeSlot.replace('-', ' ').toUpperCase()],
                  ['Language', (profile.lang || 'en').toUpperCase()],
                  ['Screen', `${profile.screen_w}px wide`],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffd814' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '20px 16px 48px' }}>

        {/* Recommendation Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${recs.length}, 1fr)`, gap: 12, marginBottom: 24 }}>
          {recs.map((r, i) => (
            <div key={r.category} onClick={() => switchRec(i)} style={{
              background: activeRec === i ? '#fff' : 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '16px 18px', cursor: 'pointer',
              border: activeRec === i ? '2px solid #2874f0' : '2px solid transparent',
              boxShadow: activeRec === i ? '0 4px 20px rgba(40,116,240,0.15)' : '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#212121' }}>{r.title}</div>
              <div style={{ fontSize: 11.5, color: '#888', marginTop: 4, lineHeight: 1.4 }}>
                {r.reason.substring(0, 70)}...
              </div>
              {activeRec === i && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: '#2874f0' }}>✓ Active →</div>}
            </div>
          ))}
        </div>

        {/* AI Reasoning Banner */}
        {cur && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', border: '1.5px solid #a5d6a7', borderRadius: 10, padding: '16px 22px', marginBottom: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#2e7d32', marginBottom: 3 }}>AI Reasoning</div>
              <div style={{ fontSize: 14, color: '#388e3c', lineHeight: 1.6 }}>{cur.reason}</div>
            </div>
            <button onClick={() => { setPhase('scanning'); setTimeout(() => { const p = detectProfile(); const r = getRecommendations(p); setRecs(r); setActiveRec(0); fetchProducts(r[0]?.category); setPhase('ready') }, 2800) }}
              style={{ marginLeft: 'auto', flexShrink: 0, background: '#2874f0', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              🔄 Re-analyze
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '3px solid #2874f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#212121', margin: 0 }}>
              {cur?.icon} Recommended: {cur?.title}
            </h2>
            <Link to={`/products?category=${cur?.category}`}
              style={{ fontSize: 13, color: '#2874f0', fontWeight: 700, border: '1px solid #2874f0', borderRadius: 4, padding: '6px 14px', textDecoration: 'none' }}>
              See All →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 1, background: '#e0e0e0' }}>
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
              : products.length === 0
                ? <div style={{ background: '#fff', gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#888' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                    <p>No products found. Please seed the database first.</p>
                    <Link to="/products" style={{ color: '#2874f0', fontWeight: 700, fontSize: 14 }}>Browse All Products →</Link>
                  </div>
                : products.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', marginTop: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#212121', marginBottom: 16 }}>🔐 How It Works (100% Private)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { icon: '🖥️', title: 'Device Type', desc: 'Detects mobile, tablet or desktop from User Agent' },
              { icon: '⏰', title: 'Time of Day', desc: 'Morning, afternoon, evening sessions get different picks' },
              { icon: '💻', title: 'Platform', desc: 'Windows, Mac, Linux, Android, iOS — each suggests best-fit tools' },
              { icon: '🔒', title: 'No Tracking', desc: '100% browser-side. No data is sent to any server. Privacy-first.' },
            ].map(h => (
              <div key={h.title} style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{h.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#212121', marginBottom: 4 }}>{h.title}</div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

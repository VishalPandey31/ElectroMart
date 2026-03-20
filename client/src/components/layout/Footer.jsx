import { Link } from 'react-router-dom'

const LINKS = {
  'ABOUT': ['About Us', 'Careers', 'Press', 'Corporate Info', 'Sitemap'],
  'HELP': ['Contact Us', 'AI Recommender', 'Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'],
  'CONSUMER POLICY': ['Cancellation Policy', 'Return Policy', 'Terms Of Use', 'Security', 'Privacy'],
  'SOCIAL': ['Facebook', 'Twitter', 'YouTube', 'Instagram'],
}

const PAYMENTS = ['💳 Visa', '💳 Mastercard', '💳 UPI', '💳 Paytm', '💳 NetBanking', '💳 COD']

export default function Footer() {
  return (
    <footer style={{ background: '#172337', marginTop: 16 }}>
      {/* ── Trust strip ── */}
      <div style={{ background: '#1a2d4d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { icon: '🏪', t: '100% Original', d: 'Guaranteed authentic products' },
              { icon: '↩️', t: '7-Day Return', d: 'Change of mind accepted' },
              { icon: '🚚', t: 'Free Delivery', d: 'On orders above ₹999' },
              { icon: '🔒', t: 'Secure Payment', d: 'Every transaction protected' },
            ].map((f, i) => (
              <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 14px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e0e0e0', marginBottom: 2 }}>{f.t}</div>
                  <div style={{ fontSize: 11.5, color: '#7a8898' }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="container" style={{ padding: '36px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 28 }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #2874f0, #1a5dd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1.5px solid rgba(255,255,255,0.2)' }}>⚡</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Electro<span style={{ color: '#ffd814' }}>Mart</span></div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Superstore for Makers</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: '#7a8898', lineHeight: 1.8, marginBottom: 16 }}>
              India's trusted store for Arduino, ESP32, sensors, modules and electronics components. Everything you need to build amazing projects.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: '📘', url: '#', label: 'Facebook', color: '#1877f2' },
                { icon: '🐦', url: '#', label: 'Twitter', color: '#1da1f2' },
                { icon: '🎬', url: '#', label: 'YouTube', color: '#ff0000' },
                { icon: '📸', url: '#', label: 'Instagram', color: '#e1306c' },
              ].map(s => (
                <a key={s.label} href={s.url} title={s.label}
                  style={{ width: 34, height: 34, borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: 11.5, fontWeight: 700, color: '#9aa5b4', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {title}
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map(l => (
                  <li key={l}>
                    {l === 'Contact Us' ? (
                      <Link to="/contact" style={{ fontSize: 13, color: '#7a8898', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#7a8898'}>{l}</Link>
                    ) : l === 'AI Recommender' ? (
                      <Link to="/smart-recommender" style={{ fontSize: 13, color: '#7a8898', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#7a8898'}>{l}</Link>
                    ) : (
                      <a href="#" style={{ fontSize: 13, color: '#7a8898', transition: 'color 0.15s, padding-left 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#7a8898'; e.currentTarget.style.paddingLeft = '0' }}>
                        {l}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment + App Store ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#9aa5b4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Payment Methods</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PAYMENTS.map(p => (
                <span key={p} style={{ background: '#fff', color: '#333', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{p}</span>
              ))}
            </div>
          </div>

          {/* App Buttons */}
          <div>
            <div style={{ fontSize: 11, color: '#9aa5b4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Download App</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: '🍎', title: 'App Store', sub: 'Available on' },
                { icon: '🤖', title: 'Google Play', sub: 'Get it on' },
              ].map(a => (
                <div key={a.title} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 9.5, color: '#9aa5b4' }}>{a.sub}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 0', background: '#0f1c2d' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12.5, color: '#5a6678' }}>
            © 2026 <span style={{ color: '#8898aa' }}>ElectroMart Technologies Pvt. Ltd.</span> All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Grievance Redressal'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#5a6678', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#9aa5b4'}
                onMouseLeave={e => e.currentTarget.style.color = '#5a6678'}>
                {l}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#5a6678', display: 'flex', alignItems: 'center', gap: 5 }}>
            🔒 SSL Secured | PCI DSS Compliant
          </span>
        </div>
      </div>
    </footer>
  )
}

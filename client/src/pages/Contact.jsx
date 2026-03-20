import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    toast.success('Message sent! We\'ll reply within 24 hours.')
  }

  const inp = {
    width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 6, padding: '11px 14px',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#212121', background: '#fafafa',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const focus = (e) => (e.target.style.borderColor = '#2874f0')
  const blur  = (e) => (e.target.style.borderColor = '#e0e0e0')

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a237e 0%, #2874f0 100%)', padding: '52px 0 44px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎧</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto 24px' }}>
            We're here to help! Reach out for product queries, orders, or technical support.
          </p>
          <a href="tel:8149377447"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#ffd814', color: '#111', fontWeight: 800, fontSize: 20, padding: '14px 32px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            📞 8149377447
          </a>
          <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Mon – Sat · 9 AM – 7 PM IST</div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 16px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* Contact Form */}
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '32px 36px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#212121', marginBottom: 6 }}>Send Us a Message</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>We typically reply within 24 hours on business days.</p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 800, color: '#212121', marginBottom: 8 }}>Message Received!</h3>
                <p style={{ color: '#666', marginBottom: 24 }}>Our team will get back to you at <strong>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 6, padding: '11px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Full Name *</label>
                    <input style={inp} value={form.name} onChange={set('name')} onFocus={focus} onBlur={blur} placeholder="Vishal Sharma" required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email Address *</label>
                    <input style={inp} type="email" value={form.email} onChange={set('email')} onFocus={focus} onBlur={blur} placeholder="you@email.com" required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Subject</label>
                  <input style={inp} value={form.subject} onChange={set('subject')} onFocus={focus} onBlur={blur} placeholder="Order query / Product inquiry / Technical support" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Message *</label>
                  <textarea style={{ ...inp, minHeight: 130, resize: 'vertical' }} value={form.message} onChange={set('message')} onFocus={focus} onBlur={blur} placeholder="Describe your query in detail..." required />
                </div>
                <button type="submit" disabled={sending}
                  style={{ background: sending ? '#90a4ae' : '#2874f0', color: '#fff', border: 'none', borderRadius: 6, padding: '13px 0', fontWeight: 800, fontSize: 15, cursor: sending ? 'wait' : 'pointer', transition: 'background 0.2s' }}>
                  {sending ? '⏳ Sending...' : '📤 Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '📞', title: 'Customer Support', detail: '8149377447', sub: 'Mon–Sat, 9 AM – 7 PM', link: 'tel:8149377447', linkLabel: 'Call Now' },
              { icon: '📧', title: 'Email Us', detail: 'support@electromart.in', sub: 'Reply within 24 hours', link: 'mailto:support@electromart.in', linkLabel: 'Send Email' },
              { icon: '💬', title: 'WhatsApp', detail: 'Chat Support', sub: 'Quick replies on WhatsApp', link: 'https://wa.me/918149377447', linkLabel: 'Open WhatsApp' },
              { icon: '🏢', title: 'Our Office', detail: 'ElectroMart HQ', sub: 'Pune, Maharashtra, India 411001', link: null },
            ].map(c => (
              <div key={c.title} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#e8effc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{c.title}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#212121', margin: '2px 0' }}>{c.detail}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{c.sub}</div>
                    {c.link && <a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#2874f0', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 6 }}>{c.linkLabel} →</a>}
                  </div>
                </div>
              </div>
            ))}

            {/* Hours */}
            <div style={{ background: '#2874f0', borderRadius: 8, padding: '18px 20px', color: '#fff' }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>🕐 Business Hours</div>
              {[['Mon – Fri', '9:00 AM – 7:00 PM'], ['Saturday', '10:00 AM – 5:00 PM'], ['Sunday', 'Closed']].map(([d, t]) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{d}</span>
                  <span style={{ fontWeight: 700 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '28px 32px', marginTop: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#212121', marginBottom: 20 }}>❓ Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { q: 'How long does delivery take?', a: 'Standard delivery: 3–5 business days. Express: 1–2 days for most pin codes.' },
              { q: 'What is the return policy?', a: 'We offer a 7-day easy return policy. Items must be unused and in original packaging.' },
              { q: 'Do you offer bulk/institutional discounts?', a: 'Yes! Contact us directly at 8149377447 for B2B pricing and institutional orders.' },
              { q: 'Are the products genuine?', a: '100% authentic. We source directly from authorized distributors and brands.' },
            ].map(f => (
              <div key={f.q} style={{ padding: '16px', background: '#f9f9f9', borderRadius: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#212121', marginBottom: 6 }}>Q: {f.q}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>A: {f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

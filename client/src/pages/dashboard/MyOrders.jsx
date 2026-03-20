import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

const STATUS_COLORS = {
  pending:    { bg: 'rgba(255,164,28,0.1)', border: 'rgba(255,164,28,0.25)', text: '#ffa41c', icon: '🕐' },
  confirmed:  { bg: 'rgba(40,116,240,0.1)', border: 'rgba(40,116,240,0.25)', text: '#4da8ff', icon: '✅' },
  processing: { bg: 'rgba(40,116,240,0.1)', border: 'rgba(40,116,240,0.25)', text: '#4da8ff', icon: '⚙️' },
  shipped:    { bg: 'rgba(137,87,229,0.1)', border: 'rgba(137,87,229,0.25)', text: '#a78bfa', icon: '🚚' },
  delivered:  { bg: 'rgba(63,185,80,0.1)',  border: 'rgba(63,185,80,0.25)',  text: '#3fb950', icon: '📦' },
  cancelled:  { bg: 'rgba(248,81,73,0.1)',  border: 'rgba(248,81,73,0.25)',  text: '#f85149', icon: '✗' },
  refunded:   { bg: 'rgba(248,81,73,0.07)', border: 'rgba(248,81,73,0.2)',   text: '#f85149', icon: '↩️' },
}

const STEPS = ['confirmed', 'processing', 'shipped', 'delivered']

function OrderTracker({ status }) {
  const stepIndex = STEPS.indexOf(status)
  if (stepIndex === -1 || status === 'cancelled') return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 10, marginBottom: 6, overflow: 'hidden' }}>
      {STEPS.map((step, i) => {
        const done = i <= stepIndex
        const active = i === stepIndex
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#2874f0' : '#1e2530',
                border: active ? '2.5px solid #58a6ff' : done ? '2.5px solid #2874f0' : '2px solid #2d3748',
                fontSize: 13, color: done ? '#fff' : '#4d5562', fontWeight: 800, transition: 'all 0.3s',
                boxShadow: active ? '0 0 0 4px rgba(40,116,240,0.2)' : 'none',
              }}>
                {done ? (i === stepIndex ? STATUS_COLORS[step]?.icon || '→' : '✓') : i + 1}
              </div>
              <div style={{ fontSize: 9.5, color: done ? '#4da8ff' : '#4d5562', marginTop: 4, whiteSpace: 'nowrap', textTransform: 'capitalize', fontWeight: done ? 700 : 400 }}>
                {step}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 3, background: i < stepIndex ? '#2874f0' : '#1e2530', margin: '0 4px', marginBottom: 18, borderRadius: 2, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, padding: 20, height: 130 }}>
          <div className="skeleton" style={{ width: '30%', height: 14, borderRadius: 6, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: '60%', height: 12, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '45%', height: 12, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eef5', display: 'flex', alignItems: 'center', gap: 8 }}>
          📦 My Orders <span style={{ fontSize: 14, color: '#6e7681', fontWeight: 500 }}>({orders.length})</span>
        </h2>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                background: filter === f ? '#2874f0' : '#0d1117',
                color: filter === f ? '#fff' : '#8b949e',
                border: `1px solid ${filter === f ? '#2874f0' : '#2d3748'}`,
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 52, marginBottom: 14 }}>📦</p>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#e8eef5', marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: '#6e7681', marginBottom: 22, fontSize: 14 }}>
            {filter !== 'all' ? `No ${filter} orders found.` : "You haven't placed any orders yet."}
          </p>
          <Link to="/products">
            <button style={{ background: 'linear-gradient(135deg, #2874f0, #1a5dd4)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 26px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Start Shopping →
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending
            return (
              <div key={order._id}
                style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2d3748'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2530'}>
                {/* Header */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e2530', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, background: '#0a0f1a' }}>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#6e7681', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Order ID</div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#e8eef5' }}>#{order.orderNumber}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#6e7681', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Placed On</div>
                      <div style={{ fontSize: 13.5, color: '#c9d1d9', fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#6e7681', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>Total</div>
                      <div style={{ fontSize: 15, color: '#e8eef5', fontWeight: 900 }}>₹{order.totalPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, padding: '5px 14px', fontSize: 13, color: sc.text, fontWeight: 700, textTransform: 'capitalize' }}>
                    {sc.icon} {order.status}
                  </span>
                </div>

                {/* Products */}
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                    {order.orderItems?.slice(0, 4).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#060910', borderRadius: 8, border: '1px solid #1e2530' }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'contain', background: '#111' }}
                          onError={e => e.target.style.display = 'none'} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#c9d1d9', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: 11.5, color: '#6e7681' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    {order.orderItems?.length > 4 && (
                      <div style={{ display: 'flex', alignItems: 'center', padding: '7px 12px', fontSize: 13, color: '#6e7681', border: '1px solid #1e2530', borderRadius: 8 }}>
                        +{order.orderItems.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* Order tracker */}
                  <OrderTracker status={order.status} />

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link to={`/dashboard/orders/${order._id}`}>
                      <button style={{ padding: '7px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, background: 'transparent', border: '1px solid #2d3748', color: '#c9d1d9', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#4da8ff'; e.currentTarget.style.color = '#4da8ff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.color = '#c9d1d9' }}>
                        View Details →
                      </button>
                    </Link>
                    {(order.status === 'shipped' || order.status === 'processing') && order.trackingNumber && (
                      <a href={order.trackingUrl || '#'} target="_blank" rel="noreferrer">
                        <button style={{ padding: '7px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, background: '#2874f0', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}
                          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                          onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                          🚚 Track Order
                        </button>
                      </a>
                    )}
                    {order.status === 'delivered' && (
                      <button style={{ padding: '7px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.2)', color: '#3fb950', cursor: 'pointer' }}>
                        ⭐ Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders

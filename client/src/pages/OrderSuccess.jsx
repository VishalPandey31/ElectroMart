import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const STEP_ICONS = {
  pending: '🕐',
  confirmed: '✅',
  processing: '⚙️',
  shipped: '🚚',
  delivered: '📦',
}

const OrderSuccess = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <p style={{ color: '#878787' }}>Loading order details…</p>
      </div>
    </div>
  )

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : 0
  const isCOD = order?.paymentMethod === 'cod'
  const isSuccess = order?.isPaid || isCOD

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container" style={{ padding: '10px 16px' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/dashboard/orders">My Orders</Link>
            <span className="sep">›</span>
            <span style={{ color: '#212121' }}>Order Confirmed</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 16px 48px', maxWidth: 800 }}>

        {/* Success Header Card */}
        <div style={{
          background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '36px 32px', textAlign: 'center', marginBottom: 16,
        }} className="fade-in">
          <div style={{ fontSize: 64, marginBottom: 12 }}>{isSuccess ? '🎉' : '⏳'}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#212121', marginBottom: 8 }}>
            {isCOD ? 'Order Placed Successfully!' : isSuccess ? 'Payment Successful!' : 'Order Received!'}
          </h1>
          {order && (
            <p style={{ fontSize: 15, color: '#878787', marginBottom: 4 }}>
              Order ID: <strong style={{ color: '#2874f0' }}>#{order.orderNumber}</strong>
            </p>
          )}
          <p style={{ fontSize: 14, color: '#878787', marginBottom: 28 }}>
            A confirmation email has been sent to your registered email address.
          </p>

          {/* Order status tracker */}
          {order && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative', padding: '0 12px', marginBottom: 8 }}>
              {/* connector line */}
              <div style={{ position: 'absolute', top: 14, left: '10%', right: '10%', height: 2, background: '#e0e0e0', zIndex: 0 }} />
              {STATUS_STEPS.map((s, i) => {
                const done = i <= currentStep
                const active = i === currentStep
                return (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, zIndex: 1 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: done ? (active ? '#2874f0' : '#388e3c') : '#e0e0e0',
                      border: `2px solid ${done ? (active ? '#2874f0' : '#388e3c') : '#ccc'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: done ? 13 : 11, color: done ? '#fff' : '#878787',
                      fontWeight: 800, boxShadow: active ? '0 0 0 4px rgba(40,116,240,0.15)' : 'none',
                      transition: 'all 0.3s',
                    }}>
                      {done && !active ? '✓' : active ? STEP_ICONS[s] : i + 1}
                    </div>
                    <span style={{
                      fontSize: 11, textTransform: 'capitalize', fontWeight: done ? 700 : 400,
                      color: done ? (active ? '#2874f0' : '#388e3c') : '#878787',
                    }}>{s}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Items Card */}
        {order?.orderItems?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '20px 24px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#484848', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 12 }}>
              Order Summary
            </h2>
            {order.orderItems.map(item => (
              <div key={item.product} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f9f9f9', alignItems: 'center' }}>
                <img src={item.image} alt={item.name}
                  style={{ width: 52, height: 52, borderRadius: 4, objectFit: 'contain', background: '#f8f9fa', padding: 4 }}
                  onError={e => e.target.style.display = 'none'}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#212121' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: '#878787', marginTop: 2 }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#212121' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, marginTop: 16, paddingTop: 12, borderTop: '1px dashed #e0e0e0', color: '#212121' }}>
              <span>Total Paid</span>
              <span style={{ color: '#2874f0' }}>₹{order.totalPrice?.toLocaleString()}</span>
            </div>
            {isCOD && (
              <div style={{ marginTop: 10, background: '#fff8e1', borderRadius: 4, padding: '8px 14px', fontSize: 12.5, color: '#f57f17', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                💵 Cash on Delivery — Please keep exact change ready
              </div>
            )}
          </div>
        )}

        {/* Delivery info & CTAs */}
        {order?.shippingAddress && (
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '16px 24px', marginBottom: 16 }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>📍 Delivery Address</h3>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#212121' }}>{order.shippingAddress.fullName}</p>
            <p style={{ fontSize: 13, color: '#484848', marginTop: 3 }}>
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city},
              {' '}{order.shippingAddress.state} – {order.shippingAddress.pincode}
            </p>
            <p style={{ fontSize: 13, color: '#484848', marginTop: 2 }}>📞 {order.shippingAddress.phone}</p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/dashboard/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#2874f0', color: '#fff', borderRadius: 4,
            padding: '12px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(40,116,240,0.3)', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a5dd4'}
            onMouseLeave={e => e.currentTarget.style.background = '#2874f0'}
          >
            📦 View My Orders
          </Link>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', color: '#2874f0', borderRadius: 4,
            border: '1.5px solid #2874f0', padding: '12px 28px', fontWeight: 700, fontSize: 14, textDecoration: 'none',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e8f1fc' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import { PageLoader } from '../../components/ui/Loaders'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!order) return <div style={{ padding: 40, textAlign: 'center' }}><p>Order not found</p><Link to="/dashboard/orders" className="btn-primary" style={{ marginTop: 12 }}>Back to Orders</Link></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link to="/dashboard/orders" style={{ color: 'var(--accent-light)', fontSize: 14 }}>← Orders</Link>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Order #{order.orderNumber}</h2>
      </div>
      <div className="glass-card" style={{ padding: 24, marginBottom: 18 }}>
        <h4 style={{ fontWeight: 600, marginBottom: 14 }}>Items Ordered</h4>
        {order.orderItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <img src={item.image} alt={item.name} style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
            </div>
            <p style={{ fontWeight: 700 }}>₹{(item.price * item.quantity)?.toLocaleString()}</p>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, fontWeight: 800, fontSize: 18 }}>
          Total: ₹{order.totalPrice?.toLocaleString()}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>📍 Shipping Address</h4>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.addressLine1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>💳 Payment</h4>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>Method: {order.paymentMethod}</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Status: <span style={{ color: order.isPaid ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>{order.isPaid ? 'Paid' : 'Pending'}</span></p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: 8 }}>Order Status: <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>{order.status}</span></p>
          {order.trackingNumber && <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Tracking: {order.trackingNumber}</p>}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

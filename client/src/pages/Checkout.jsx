import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STEPS = ['Shipping', 'Payment', 'Review']

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [address, setAddress] = useState(() => {
    const def = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || {}
    return {
      fullName: def.fullName || user?.name || '',
      phone: def.phone || user?.phone || '',
      addressLine1: def.addressLine1 || '',
      addressLine2: def.addressLine2 || '',
      city: def.city || '',
      state: def.state || '',
      pincode: def.pincode || '',
    }
  })

  const items = cart.items || []
  const shipping = cartTotal >= 999 ? 0 : 99
  const tax = Math.round(cartTotal * 0.18)
  const total = cartTotal + shipping + tax - (cart.couponDiscount || 0)

  const validateAddress = () => {
    const req = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode']
    return req.every(f => address[f]?.trim())
  }

  const placeOrder = async () => {
    if (!validateAddress()) { toast.error('Please fill all required address fields'); return }
    setPlacing(true)
    try {
      const orderData = {
        orderItems: items.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.images?.[0]?.url || '', price: i.price, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        couponDiscount: cart.couponDiscount || 0,
      }
      const { data: orderRes } = await api.post('/orders', orderData)
      const order = orderRes.order

      if (paymentMethod === 'cod') {
        await api.post('/payment/cod', { orderId: order._id })
        clearCart?.()
        toast.success('Order placed successfully!')
        navigate(`/order-success/${order._id}`)
        return
      }

      // Razorpay
      const { data: rpRes } = await api.post('/payment/razorpay/create-order', { amount: total })
      const options = {
        key: rpRes.key,
        amount: rpRes.order.amount,
        currency: 'INR',
        name: 'ElectroMart',
        description: `Order #${order.orderNumber}`,
        order_id: rpRes.order.id,
        handler: async (response) => {
          try {
            await api.post('/payment/razorpay/verify', { ...response, orderId: order._id })
            clearCart?.()
            toast.success('Payment successful! Order confirmed.')
            navigate(`/order-success/${order._id}`)
          } catch { toast.error('Payment verification failed') }
        },
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: '#2874f0' },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) { toast.error(err.message || 'Failed to place order') }
    finally { setPlacing(false) }
  }

  const inputStyle = {
    width: '100%', background: '#fff', border: '1px solid #cacaca',
    borderRadius: 4, padding: '10px 14px', color: '#212121',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }
  const onFocus = e => { e.target.style.borderColor = '#2874f0'; e.target.style.boxShadow = '0 0 0 3px rgba(40,116,240,0.08)' }
  const onBlur  = e => { e.target.style.borderColor = '#cacaca'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container" style={{ padding: '10px 16px' }}>
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span className="sep">›</span>
            <a href="/cart">Cart</a>
            <span className="sep">›</span>
            <span style={{ color: '#212121' }}>Checkout</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '20px 16px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#212121', marginBottom: 20 }}>Checkout</h1>

        {/* Step indicator */}
        <div style={{
          background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '18px 28px', marginBottom: 16, display: 'flex', alignItems: 'center',
        }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', fontWeight: 800, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  background: i < step ? '#388e3c' : i === step ? '#2874f0' : '#e0e0e0',
                  color: i <= step ? '#fff' : '#878787',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontWeight: i === step ? 700 : 500, fontSize: 14,
                  color: i === step ? '#2874f0' : i < step ? '#388e3c' : '#878787',
                }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, background: i < step ? '#388e3c' : '#e0e0e0',
                  margin: '0 12px', transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
          {/* ── Main content ── */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '28px 32px' }}>

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#212121', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📍 Delivery Address
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    ['fullName', 'Full Name *', 'text'],
                    ['phone', 'Phone Number *', 'tel'],
                    ['addressLine1', 'Address Line 1 *', 'text'],
                    ['addressLine2', 'Address Line 2 (Optional)', 'text'],
                    ['city', 'City *', 'text'],
                    ['state', 'State *', 'text'],
                    ['pincode', 'Pincode *', 'text'],
                  ].map(([key, label, type]) => (
                    <div key={key} style={{ gridColumn: (key === 'addressLine1' || key === 'addressLine2') ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#484848', marginBottom: 6 }}>{label}</label>
                      <input
                        type={type}
                        value={address[key]}
                        onChange={e => setAddress(p => ({ ...p, [key]: e.target.value }))}
                        style={inputStyle}
                        onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => validateAddress() ? setStep(1) : toast.error('Please fill all required fields')}
                  style={{
                    marginTop: 24, background: '#2874f0', color: '#fff', border: 'none',
                    borderRadius: 4, padding: '12px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a5dd4'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2874f0'}
                >
                  Save & Deliver Here →
                </button>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#212121', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  💳 Payment Options
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { value: 'razorpay', icon: '💳', label: 'Razorpay', desc: 'UPI, Cards, Net Banking, Wallets — Powered by Razorpay' },
                    { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives at your doorstep' },
                  ].map(pm => (
                    <label
                      key={pm.value}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                        borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                        border: `2px solid ${paymentMethod === pm.value ? '#2874f0' : '#e0e0e0'}`,
                        background: paymentMethod === pm.value ? '#e8f1fc' : '#fff',
                      }}
                    >
                      <input
                        type="radio" name="payment" value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={() => setPaymentMethod(pm.value)}
                        style={{ accentColor: '#2874f0', marginTop: 1 }}
                      />
                      <span style={{ fontSize: 22 }}>{pm.icon}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14.5, color: '#212121' }}>{pm.label}</p>
                        <p style={{ fontSize: 12.5, color: '#878787', marginTop: 2 }}>{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setStep(0)} style={{ padding: '11px 22px', borderRadius: 4, border: '1.5px solid #2874f0', background: '#fff', color: '#2874f0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => setStep(2)} style={{ padding: '11px 28px', borderRadius: 4, border: 'none', background: '#2874f0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a5dd4'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2874f0'}
                  >Continue to Review →</button>
                </div>
              </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#212121', marginBottom: 20 }}>📋 Review Your Order</h3>

                {/* Items */}
                <div style={{ marginBottom: 18 }}>
                  {items.map(item => (
                    <div key={item.product._id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                      <img src={item.product.images?.[0]?.url} alt={item.product.name}
                        style={{ width: 56, height: 56, borderRadius: 4, objectFit: 'contain', background: '#f8f9fa', padding: 4 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, color: '#212121' }}>{item.product.name}</p>
                        <p style={{ fontSize: 12, color: '#878787', marginTop: 2 }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#212121' }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery address */}
                <div style={{ padding: '14px 16px', background: '#f1f3f6', borderRadius: 4, marginBottom: 20, border: '1px solid #e0e0e0' }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#484848', marginBottom: 4 }}>📍 Deliver to:</p>
                  <p style={{ fontSize: 13.5, color: '#212121', fontWeight: 600 }}>{address.fullName} · {address.phone}</p>
                  <p style={{ fontSize: 13, color: '#878787', marginTop: 2 }}>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state} – {address.pincode}</p>
                </div>

                {/* Payment */}
                <div style={{ padding: '12px 16px', background: '#f1f3f6', borderRadius: 4, marginBottom: 24, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{paymentMethod === 'cod' ? '💵' : '💳'}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#484848' }}>Payment via {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ padding: '12px 22px', borderRadius: 4, border: '1.5px solid #2874f0', background: '#fff', color: '#2874f0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Back</button>
                  <button onClick={placeOrder} disabled={placing}
                    style={{
                      flex: 1, padding: '13px', borderRadius: 4, border: 'none', cursor: placing ? 'not-allowed' : 'pointer',
                      background: placing ? '#90a4ae' : paymentMethod === 'cod' ? '#fb8c00' : '#2874f0',
                      color: '#fff', fontWeight: 800, fontSize: 16, transition: 'background 0.15s',
                    }}>
                    {placing ? '⏳ Placing Order...' : paymentMethod === 'cod' ? `✓ Place Order (COD) — ₹${total.toLocaleString()}` : `💳 Pay ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 20, position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: '#878787', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}>
              Price Details
            </h3>
            {[
              ['Price (' + items.length + ' items)', `₹${cartTotal.toLocaleString()}`],
              ['Delivery Charges', shipping === 0 ? '🏷 FREE' : `₹${shipping}`],
              ['GST (18%)', `₹${tax.toLocaleString()}`],
              ...(cart.couponDiscount > 0 ? [['Coupon Discount', `−₹${cart.couponDiscount}`]] : []),
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12, color: '#484848' }}>
                <span>{l}</span>
                <span style={{ color: l.includes('Discount') ? '#388e3c' : '#212121', fontWeight: l.includes('Discount') ? 700 : 400 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, color: '#212121' }}>
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            {shipping === 0 && (
              <div style={{ marginTop: 12, background: '#e8f5e9', borderRadius: 4, padding: '8px 12px', fontSize: 12.5, color: '#2e7d32', fontWeight: 600 }}>
                🎉 You saved ₹99 on delivery charges!
              </div>
            )}
            {/* Trust badges */}
            <div style={{ marginTop: 20, borderTop: '1px solid #f0f0f0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🔒 100% Secure Payments', '✅ Genuine Products Guaranteed', '↩️ Easy 7-Day Returns'].map(t => (
                <div key={t} style={{ fontSize: 12, color: '#878787', display: 'flex', alignItems: 'center', gap: 6 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  )
}

export default Checkout

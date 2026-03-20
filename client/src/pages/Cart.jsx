import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const COUPONS = {
  'ELECTRO10': { type: 'pct', value: 10, label: '10% off up to ₹200' },
  'FIRST100':  { type: 'flat', value: 100, label: '₹100 flat off' },
  'SAVE50':    { type: 'flat', value: 50, label: '₹50 flat off' },
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponErr, setCouponErr] = useState('')

  const items = cart?.items || []
  const subtotal = items.reduce((a, i) => a + (i.discountPrice || i.price) * i.quantity, 0)
  const savings = items.reduce((a, i) => a + ((i.price - (i.discountPrice || i.price)) * i.quantity), 0)
  const freeDeliveryThreshold = 999
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 49
  const deliveryNeeded = Math.max(0, freeDeliveryThreshold - subtotal)

  let discount = 0
  if (appliedCoupon) {
    const c = COUPONS[appliedCoupon]
    if (c.type === 'pct') discount = Math.min(subtotal * c.value / 100, 200)
    else discount = c.value
  }

  const total = subtotal - discount + deliveryFee

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (COUPONS[code]) { setAppliedCoupon(code); setCouponErr(''); toast.success(`Coupon "${code}" applied!`) }
    else { setCouponErr('Invalid coupon code'); setAppliedCoupon(null) }
  }

  if (items.length === 0) return (
    <div style={{ background: '#f1f3f6', minHeight: '60vh' }}>
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '56px 24px', maxWidth: 500, margin: '0 auto' }}>
          <p style={{ fontSize: 60, marginBottom: 16 }}>🛒</p>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: '#212121', marginBottom: 10 }}>Your cart is empty!</h2>
          <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>Add items to your cart to shop</p>
          <Link to="/products">
            <button style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>Shop Now →</button>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep">›</span>
            <Link to="/products">Shop</Link><span className="sep">›</span>
            <span style={{ color: '#212121' }}>Cart ({items.length})</span>
          </div>
        </div>
      </div>

      {/* Delivery progress */}
      {deliveryNeeded > 0 && (
        <div style={{ background: '#fff7e6', borderBottom: '1px solid #ffe0b2', padding: '8px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>🚚</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: '#e65100', fontWeight: 700, marginBottom: 4 }}>
                Add ₹{deliveryNeeded.toFixed(0)} more for FREE delivery!
              </div>
              <div style={{ height: 6, background: '#ffe0b2', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(subtotal / freeDeliveryThreshold) * 100}%`, background: '#ff9100', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {deliveryNeeded === 0 && (
        <div style={{ background: '#e8f5e9', borderBottom: '1px solid #c8e6c9', padding: '8px 0' }}>
          <div className="container">
            <span style={{ fontSize: 13.5, color: '#2e7d32', fontWeight: 700 }}>🎉 You've unlocked FREE delivery!</span>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'start' }}>

          {/* ── Cart items ── */}
          <div>
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 800, fontSize: 16, color: '#212121' }}>My Cart ({items.length})</h2>
                {savings > 0 && <span style={{ fontSize: 13, color: '#388e3c', fontWeight: 700 }}>🎁 You save ₹{savings.toLocaleString()} on this order</span>}
              </div>

              {items.map((item, idx) => {
                const finalPrice = item.discountPrice || item.price
                const itemDiscount = item.price > finalPrice ? Math.round(((item.price - finalPrice) / item.price) * 100) : 0
                return (
                  <div key={item._id || idx} style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: 16, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    {/* Image */}
                    <div style={{ width: 90, height: 90, flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, background: '#fff' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <Link to={`/products/${item.slug}`} style={{ fontSize: 14.5, fontWeight: 600, color: '#212121', display: 'block', marginBottom: 4, lineHeight: 1.4 }}>{item.name}</Link>
                      {item.seller && <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Seller: {item.seller}</div>}

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#212121' }}>₹{finalPrice?.toLocaleString()}</span>
                        {itemDiscount > 0 && <>
                          <span style={{ fontSize: 13, color: '#888', textDecoration: 'line-through' }}>₹{item.price?.toLocaleString()}</span>
                          <span style={{ fontSize: 12.5, color: '#388e3c', fontWeight: 700 }}>{itemDiscount}% off</span>
                        </>}
                      </div>

                      {/* Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {/* Qty stepper */}
                        <div style={{ display: 'flex', border: '1px solid #c8c8c8', borderRadius: 3, overflow: 'hidden' }}>
                          <button onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeFromCart(item._id)}
                            style={{ width: 32, height: 32, background: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                          <span style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#212121', borderLeft: '1px solid #c8c8c8', borderRight: '1px solid #c8c8c8' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{ width: 32, height: 32, background: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#2874f0', fontWeight: 600, padding: '4px 8px' }}>
                          REMOVE
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#2874f0', fontWeight: 600, padding: '4px 8px' }}>
                          SAVE FOR LATER
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#212121' }}>₹{(finalPrice * item.quantity).toLocaleString()}</div>
                      {item.quantity > 1 && <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>₹{finalPrice?.toLocaleString()} × {item.quantity}</div>}
                    </div>
                  </div>
                )
              })}

              {/* Place order button (bottom of cart) */}
              <div style={{ padding: '14px 20px', textAlign: 'right', background: '#fff' }}>
                <button onClick={() => navigate('/checkout')}
                  style={{ background: '#fb641b', color: '#fff', border: 'none', borderRadius: 4, padding: '14px 40px', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(251,100,27,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                  Place Order →
                </button>
              </div>
            </div>
          </div>

          {/* ── Price Details ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 110 }}>
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: 0.8 }}>Price Details</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: `Price (${items.length} item${items.length > 1 ? 's' : ''})`, value: `₹${subtotal.toLocaleString()}` },
                  ...(savings > 0 ? [{ label: 'Product Discount', value: `-₹${savings.toLocaleString()}`, green: true }] : []),
                  ...(discount > 0 ? [{ label: `Coupon (${appliedCoupon})`, value: `-₹${discount.toLocaleString()}`, green: true }] : []),
                  { label: 'Delivery Charges', value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, green: deliveryFee === 0 },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: r.green ? '#388e3c' : '#333' }}>
                    <span>{r.label}</span>
                    <span style={{ fontWeight: r.green ? 700 : 500 }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#212121' }}>
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {(savings + discount) > 0 && (
                  <div style={{ background: '#e8f5e9', borderRadius: 4, padding: '8px 12px', fontSize: 13, color: '#388e3c', fontWeight: 700 }}>
                    🎉 You save ₹{(savings + discount).toLocaleString()} on this order!
                  </div>
                )}
              </div>
            </div>

            {/* Coupon */}
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '14px 18px' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: '#212121', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                🏷️ Apply Coupon
              </div>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 4, padding: '10px 12px' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#2e7d32' }}>✅ {appliedCoupon}</div>
                    <div style={{ fontSize: 12, color: '#4caf50' }}>{COUPONS[appliedCoupon].label}</div>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)} style={{ background: 'none', border: 'none', color: '#c62828', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Remove</button>
                </div>
              ) : (
                <div>
                  <div className="coupon-input-wrap" style={{ marginBottom: 6 }}>
                    <input placeholder="Enter coupon code" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponErr('') }} onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                    <button onClick={applyCoupon}>APPLY</button>
                  </div>
                  {couponErr && <div style={{ fontSize: 12, color: '#c62828', marginTop: 4 }}>✗ {couponErr}</div>}
                  <div style={{ fontSize: 11.5, color: '#888', marginTop: 6 }}>Try: ELECTRO10, FIRST100, SAVE50</div>
                </div>
              )}
            </div>

            {/* Security */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <span style={{ fontSize: 12, color: '#888' }}>Safe and secure payments. Easy returns. 100% authentic products.</span>
            </div>

            {/* Checkout CTA */}
            <button onClick={() => navigate('/checkout')}
              style={{ background: '#fb641b', color: '#fff', border: 'none', borderRadius: 4, padding: '14px', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(251,100,27,0.3)', width: '100%', transition: 'filter 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

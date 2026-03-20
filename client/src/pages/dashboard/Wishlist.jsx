import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { SkeletonCard } from '../../components/ui/Loaders'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toggleWishlist } = useWishlist()
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/wishlist').then(({ data }) => setProducts(data.wishlist || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleRemove = async (productId) => {
    await toggleWishlist(productId)
    setProducts(prev => prev.filter(p => p._id !== productId))
  }

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1)
    handleRemove(productId)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eef5', display: 'flex', alignItems: 'center', gap: 8 }}>
          ❤️ My Wishlist <span style={{ fontSize: 14, color: '#6e7681', fontWeight: 500 }}>({products.length} items)</span>
        </h2>
        {products.length > 0 && (
          <button
            onClick={async () => { for (const p of products) await addToCart(p._id, 1); toast.success('All items added to cart!') }}
            style={{ padding: '8px 18px', background: 'rgba(40,116,240,0.1)', border: '1px solid rgba(40,116,240,0.2)', borderRadius: 6, color: '#4da8ff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            🛒 Add All to Cart
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 52, marginBottom: 14 }}>💛</p>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#e8eef5', marginBottom: 8 }}>Your wishlist is empty</h3>
          <p style={{ color: '#6e7681', marginBottom: 22, fontSize: 14 }}>Save items you love and shop them later</p>
          <Link to="/products">
            <button style={{ background: 'linear-gradient(135deg, #2874f0, #1a5dd4)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 26px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Browse Products →
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
          {products.map(p => {
            const finalPrice = p.discountPrice > 0 ? p.discountPrice : p.price
            const discount = p.discountPrice > 0 ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0
            return (
              <div key={p._id}
                style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2530'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>

                {/* Remove button */}
                <button onClick={() => handleRemove(p._id)}
                  style={{ position: 'absolute', top: 8, right: 8, zIndex: 3, width: 28, height: 28, borderRadius: '50%', background: 'rgba(248,81,73,0.15)', border: '1px solid rgba(248,81,73,0.25)', color: '#f85149', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.15)'}>
                  ✕
                </button>

                {/* Discount badge */}
                {discount >= 5 && (
                  <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, background: '#cc0c39', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 3 }}>
                    {discount}% off
                  </div>
                )}

                {/* Image */}
                <Link to={`/products/${p.slug}`}>
                  <div style={{ height: 160, background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                    <img src={p.images?.[0]?.url} alt={p.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      onError={e => e.target.src = 'https://placehold.co/200x160/111827/6b7280?text=?'} />
                  </div>
                </Link>

                {/* Info */}
                <div style={{ padding: '12px 14px 14px' }}>
                  {p.brand && <div style={{ fontSize: 10.5, color: '#4da8ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{p.brand}</div>}
                  <Link to={`/products/${p.slug}`} style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8 }}>
                    {p.name}
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: '#e8eef5' }}>₹{finalPrice?.toLocaleString()}</span>
                    {discount > 0 && <span style={{ fontSize: 12, color: '#8b949e', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString()}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleMoveToCart(p._id)}
                      style={{ flex: 1, padding: '8px 6px', background: 'linear-gradient(135deg, #2874f0, #1a5dd4)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                      🛒 Add to Cart
                    </button>
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

export default Wishlist

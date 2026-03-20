import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const [adding, setAdding] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  if (!product) return null

  const { _id, name, slug, price, discountPrice, images, rating, reviewCount, stock, brand, isFeatured, isNew } = product
  const finalPrice = discountPrice > 0 ? discountPrice : price
  const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0
  const inWishlist = wishlist?.includes(_id)
  const inStock = stock > 0
  const img = images?.[0]?.url

  const handleCart = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!inStock) { toast.error('Out of stock'); return }
    setAdding(true)
    try { await addToCart(_id, 1); toast.success('Added to cart!') }
    catch (err) { toast.error(err.message || 'Error') }
    finally { setAdding(false) }
  }

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation()
    toggleWishlist(_id)
    toast(inWishlist ? 'Removed from wishlist' : '♥ Added to wishlist')
  }

  const stars = '★'.repeat(Math.round(rating || 0)) + '☆'.repeat(5 - Math.round(rating || 0))

  return (
    <Link to={`/products/${slug}`}
      style={{ display: 'flex', flexDirection: 'column', background: '#fff', textDecoration: 'none', color: 'inherit', position: 'relative', transition: 'box-shadow 0.2s', cursor: 'pointer', overflow: 'hidden' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,116,240,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

      {/* Discount badge */}
      {discount >= 5 && (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#ff6161', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 2 }}>
          {discount}% off
        </div>
      )}

      {/* Badges */}
      {(isFeatured || isNew) && (
        <div style={{ position: 'absolute', top: 8, right: 36, zIndex: 2, display: 'flex', gap: 4 }}>
          {isNew && <span style={{ background: '#00897b', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 2 }}>NEW</span>}
          {isFeatured && !isNew && <span style={{ background: '#2874f0', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 2 }}>TOP</span>}
        </div>
      )}

      {/* Wishlist */}
      <button onClick={handleWishlist}
        style={{ position: 'absolute', top: 6, right: 6, zIndex: 3, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', transition: 'all 0.15s', color: inWishlist ? '#c62828' : '#aaa' }}
        onMouseEnter={e => e.currentTarget.style.color = '#c62828'}
        onMouseLeave={e => e.currentTarget.style.color = inWishlist ? '#c62828' : '#aaa'}>
        {inWishlist ? '♥' : '♡'}
      </button>

      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <img
          src={imgErr ? 'https://placehold.co/200x200/f5f5f5/999?text=?' : img}
          alt={name}
          onError={() => setImgErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {brand && <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{brand}</div>}

        <div style={{ fontSize: 13.5, color: '#212121', lineHeight: 1.4, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38 }}>
          {name}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#388e3c', color: '#fff', fontSize: 11.5, fontWeight: 700, padding: '1.5px 6px', borderRadius: 2 }}>
              {(rating || 0).toFixed(1)} ★
            </span>
            {reviewCount > 0 && <span style={{ fontSize: 11.5, color: '#888' }}>({reviewCount.toLocaleString()})</span>}
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#212121' }}>₹{finalPrice?.toLocaleString()}</span>
          {discount > 0 && <>
            <span style={{ fontSize: 12, color: '#888', textDecoration: 'line-through' }}>₹{price?.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 700 }}>{discount}% off</span>
          </>}
        </div>

        {/* Stock warning */}
        {inStock && stock <= 5 && (
          <div style={{ fontSize: 11, color: '#c62828', fontWeight: 600 }}>⚠️ Only {stock} left!</div>
        )}
        {!inStock && <div style={{ fontSize: 11.5, color: '#c62828', fontWeight: 600 }}>✗ Out of Stock</div>}

        {/* Add to Cart */}
        <button onClick={handleCart} disabled={adding || !inStock}
          style={{
            marginTop: 'auto', paddingTop: 10,
            background: '#fff',
            border: 'none', cursor: adding || !inStock ? 'not-allowed' : 'pointer',
          }}>
          <div style={{ background: adding ? '#e0e0e0' : !inStock ? '#f5f5f5' : 'linear-gradient(180deg, #ffca28 0%, #ffa000 100%)', color: !inStock ? '#aaa' : '#111', border: 'none', borderRadius: 3, padding: '8px 0', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', transition: 'all 0.15s' }}>
            {adding ? '⏳ Adding...' : !inStock ? '✗ Out of Stock' : '🛒 Add to Cart'}
          </div>
        </button>
      </div>
    </Link>
  )
}

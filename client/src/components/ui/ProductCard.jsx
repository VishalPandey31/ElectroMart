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

  const { _id, name, slug, price, discountPrice, images, rating, numReviews, stock, brand, isFeatured, isNew } = product
  const finalPrice = discountPrice > 0 ? discountPrice : price
  const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0
  const inWishlist = wishlist?.includes(_id)
  const inStock = stock > 0
  const img = images?.[0]?.url || 'https://images.weserv.nl/?url=loremflickr.com/400/400/electronics&w=400'

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

  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 4, overflow: 'hidden', position: 'relative', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      
      <Link to={`/products/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Wishlist Button */}
        <button onClick={handleWishlist}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: inWishlist ? '#ff4343' : '#c2c2c2', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          {inWishlist ? '❤' : '♡'}
        </button>

        {/* Image Section */}
        <div style={{ width: '100%', aspectRatio: '1/1', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' }}>
          <img
            src={img}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Content Section */}
        <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Brand & Name */}
          <div style={{ color: '#878787', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{brand || 'Store'}</div>
          <div style={{ fontSize: 14, color: '#212121', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, lineHeight: '20px' }}>
            {name}
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ background: '#388e3c', color: '#fff', borderRadius: 2, padding: '2px 6px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                {rating.toFixed(1)} <span style={{ fontSize: 10 }}>★</span>
              </div>
              <span style={{ color: '#878787', fontSize: 13, fontWeight: 500 }}>({numReviews || 0})</span>
              {/* Flipkart Assured Mock */}
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" style={{ height: 16 }} />
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#212121' }}>₹{finalPrice.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 14, color: '#878787', textDecoration: 'line-through' }}>₹{price.toLocaleString()}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#388e3c' }}>{discount}% off</span>
              </>
            )}
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {isNew && <span style={{ background: '#f1f3f6', color: '#212429', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 2 }}>New Arrival</span>}
            {isFeatured && <span style={{ background: '#fdeff2', color: '#e41b4d', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 2 }}>Top Rated</span>}
          </div>

          {/* Action */}
          <button onClick={handleCart} disabled={adding || !inStock}
            style={{ marginTop: 16, width: '100%', height: 40, border: 'none', borderRadius: 2, cursor: adding || !inStock ? 'not-allowed' : 'pointer', background: inStock ? '#fb641b' : '#eee', color: '#fff', fontSize: 14, fontWeight: 700, transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {adding ? '⏳...' : !inStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
        </div>
      </Link>
    </div>
  )
}

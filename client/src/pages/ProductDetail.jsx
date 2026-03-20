import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ProductCard from '../components/ui/ProductCard'
import { PageLoader } from '../components/ui/Loaders'

const StarRating = ({ rating, interactive, onRate }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s}
        onClick={() => interactive && onRate?.(s)}
        style={{
          fontSize: interactive ? 28 : 18, color: s <= rating ? '#ffa41c' : '#2d3748',
          cursor: interactive ? 'pointer' : 'default', transition: 'color 0.1s',
        }}>★</span>
    ))}
  </div>
)

const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 12.5, color: '#8b949e', minWidth: 32, textAlign: 'right' }}>{star}★</span>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: 12, color: '#6e7681', minWidth: 28 }}>{count}</span>
    </div>
  )
}

const ProductDetail = () => {
  const { slug } = useParams()
  const { addToCart, loading: cartLoading } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    setLoading(true)
    api.get(`/products/slug/${slug}`).then(({ data }) => {
      setProduct(data.product)
      setSelectedImage(0)
      return Promise.all([
        api.get(`/reviews/${data.product._id}`),
        api.get(`/products/${data.product._id}/recommendations`),
      ])
    }).then(([rev, rec]) => {
      setReviews(rev.data.reviews || [])
      setRecommendations(rec.data.products || [])
    }).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => addToCart(product._id, quantity)

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to write a review'); return }
    setSubmittingReview(true)
    try {
      const { data } = await api.post(`/reviews/${product._id}`, newReview)
      setReviews(prev => [data.review, ...prev])
      setNewReview({ rating: 5, title: '', comment: '' })
      toast.success('Review submitted!')
    } catch (err) { toast.error(err.message || 'Failed to submit review') }
    finally { setSubmittingReview(false) }
  }

  if (loading) return <PageLoader />
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px 20px', background: '#080b14', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: 56 }}>😕</p>
      <h2 style={{ fontWeight: 800, color: '#e8eef5', fontSize: 22 }}>Product Not Found</h2>
      <p style={{ color: '#6e7681', marginBottom: 8 }}>This product doesn't exist or has been removed.</p>
      <Link to="/products" style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 14, display: 'inline-block' }}>
        Browse Products
      </Link>
    </div>
  )

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
  const wishlisted = isWishlisted(product._id)
  const savings = product.price - finalPrice

  // Rating distribution for bar chart
  const ratingDist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => Math.round(r.rating) === s).length,
  }))

  return (
    <div style={{ background: '#080b14', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#0c1520', borderBottom: '1px solid #1e2530', padding: '10px 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/products">Products</Link>
            {product.category?.name && (
              <>
                <span className="sep">›</span>
                <Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link>
              </>
            )}
            <span className="sep">›</span>
            <span style={{ color: '#e8eef5' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 20px' }}>
        {/* ── Main product area ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 36, marginBottom: 40 }}>

          {/* ── Images ── */}
          <div>
            {/* Main image */}
            <div style={{
              background: '#0e1420', borderRadius: 14, overflow: 'hidden',
              border: '1.5px solid #1e2530', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              aspectRatio: '1', position: 'relative',
            }}>
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.name}
                style={{ width: '85%', height: '85%', objectFit: 'contain', transition: 'opacity 0.2s' }}
                onError={e => e.target.src = 'https://placehold.co/500x500/111827/6b7280?text=No+Image'}
              />
              {discount > 0 && (
                <div style={{ position: 'absolute', top: 12, left: 12, background: '#cc0c39', color: '#fff', fontSize: 13, fontWeight: 800, padding: '4px 12px', borderRadius: 4 }}>
                  {discount}% OFF
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    style={{
                      width: 68, height: 68, border: `2px solid ${i === selectedImage ? '#2874f0' : '#1e2530'}`,
                      borderRadius: 8, background: '#0e1420', cursor: 'pointer',
                      overflow: 'hidden', padding: 4, transition: 'all 0.15s',
                      boxShadow: i === selectedImage ? '0 0 0 3px rgba(40,116,240,0.2)' : 'none',
                    }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            {product.brand && (
              <div style={{ fontSize: 12, color: '#4da8ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>
                {product.brand}
              </div>
            )}
            <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.35, marginBottom: 12, color: '#e8eef5' }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              {product.ratings > 0 && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#2a7d2e', color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 14, fontWeight: 800 }}>
                  {product.ratings.toFixed(1)} ★
                </div>
              )}
              {product.numReviews > 0 && (
                <span style={{ fontSize: 13.5, color: '#4da8ff', fontWeight: 600 }}>
                  {product.numReviews.toLocaleString()} ratings
                </span>
              )}
              {product.sku && <span style={{ fontSize: 12, color: '#4d5562' }}>SKU: {product.sku}</span>}
            </div>

            {/* Price box */}
            <div style={{
              background: '#0d1117', border: '1px solid #1e2530',
              borderRadius: 12, padding: '18px 20px', marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 34, fontWeight: 900, color: '#e8eef5', lineHeight: 1 }}>
                  ₹{finalPrice?.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span style={{ fontSize: 18, color: '#6e7681', textDecoration: 'line-through' }}>₹{product.price?.toLocaleString()}</span>
                    <span style={{ fontSize: 16, color: '#3fb950', fontWeight: 800 }}>{discount}% off</span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <div style={{ fontSize: 13.5, color: '#3fb950', fontWeight: 700 }}>
                  You save ₹{savings.toLocaleString()}!
                </div>
              )}
              {finalPrice >= 999 && (
                <div style={{ fontSize: 13, color: '#4da8ff', marginTop: 6, fontWeight: 600 }}>
                  ✓ FREE Delivery Eligible
                </div>
              )}
            </div>

            {/* Stock status */}
            <div style={{ marginBottom: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.stock > 0 ? (
                <span className="badge badge-success">✓ In Stock ({product.stock} units)</span>
              ) : (
                <span className="badge badge-danger">✗ Out of Stock</span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="badge badge-warning">⚠ Hurry! Only {product.stock} left</span>
              )}
            </div>

            {/* Quick specs */}
            {(product.voltage || product.protocol || product.applications?.length > 0) && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {product.voltage && (
                  <span style={{ fontSize: 12, padding: '4px 12px', background: 'rgba(40,116,240,0.08)', border: '1px solid rgba(40,116,240,0.2)', borderRadius: 20, color: '#4da8ff' }}>⚡ {product.voltage}</span>
                )}
                {product.protocol && (
                  <span style={{ fontSize: 12, padding: '4px 12px', background: 'rgba(40,116,240,0.08)', border: '1px solid rgba(40,116,240,0.2)', borderRadius: 20, color: '#4da8ff' }}>📡 {product.protocol}</span>
                )}
                {product.applications?.map(app => (
                  <span key={app} style={{ fontSize: 12, padding: '4px 12px', background: '#111d2e', border: '1px solid #1e2530', borderRadius: 20, color: '#8b949e' }}>{app}</span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                <div className="qty-stepper">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button onClick={handleAddToCart} disabled={cartLoading}
                  className="btn-cart"
                  style={{ flex: 1, fontSize: 14, fontWeight: 800, padding: '11px 16px' }}>
                  🛒 Add to Cart
                </button>
              </div>
            )}

            {/* Buy now */}
            {product.stock > 0 && (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => { addToCart(product._id, quantity); window.location.href = '/checkout' }}
                  className="btn-buy"
                  style={{ fontSize: 14, fontWeight: 800, padding: '11px 16px' }}>
                  ⚡ Buy Now
                </button>
              </div>
            )}

            {/* Wishlist + Datasheet */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => toggleWishlist(product._id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '10px', background: wishlisted ? 'rgba(248,81,73,0.1)' : '#0d1117',
                  border: `1.5px solid ${wishlisted ? '#f85149' : '#2d3748'}`, borderRadius: 8,
                  color: wishlisted ? '#f85149' : '#8b949e', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {wishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
              </button>
              {product.datasheet && (
                <a href={product.datasheet} target="_blank" rel="noreferrer"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px', background: '#0d1117', border: '1.5px solid #2d3748', borderRadius: 8,
                    color: '#4da8ff', fontWeight: 700, fontSize: 13.5, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2874f0'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3748'}>
                  📄 Datasheet
                </a>
              )}
            </div>

            {/* Delivery info */}
            <div style={{ marginTop: 18, background: '#0d1117', border: '1px solid #1e2530', borderRadius: 10, padding: '14px 16px' }}>
              {[
                { icon: '🚚', text: finalPrice >= 999 ? 'FREE Delivery on this order' : 'Delivery: ₹49' },
                { icon: '↩️', text: '7-Day Easy Returns & Refunds' },
                { icon: '✅', text: '100% Genuine Product Guarantee' },
                { icon: '📦', text: 'Ships same day if ordered before 4PM' },
              ].map(d => (
                <div key={d.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 13, color: '#8b9ab5' }}>
                  <span>{d.icon}</span> {d.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, overflow: 'hidden', marginBottom: 40 }}>
          <div className="tab-bar">
            {[
              ['description', '📝 Description'],
              ['specs', '⚙️ Specifications'],
              [`reviews`, `💬 Reviews (${reviews.length})`],
            ].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`tab-btn${activeTab === tab ? ' active' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: 26 }}>
            {activeTab === 'description' && (
              <p style={{ color: '#8b9ab5', lineHeight: 1.92, whiteSpace: 'pre-line', fontSize: 14.5 }}>
                {product.description || 'No description available.'}
              </p>
            )}

            {activeTab === 'specs' && (
              product.specifications?.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {product.specifications.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #1e2530', background: i % 2 === 0 ? 'transparent' : 'rgba(40,116,240,0.02)' }}>
                        <td style={{ padding: '11px 16px', fontWeight: 700, fontSize: 13.5, width: '36%', color: '#8b9ab5' }}>{s.key}</td>
                        <td style={{ padding: '11px 16px', fontSize: 13.5, color: '#e8eef5' }}>{s.value}{s.unit ? ` ${s.unit}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6e7681', fontSize: 14 }}>No specifications listed for this product.</p>
              )
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Rating summary */}
                {reviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 32, marginBottom: 32, padding: '20px 24px', background: '#080b14', borderRadius: 10, border: '1px solid #1e2530' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 54, fontWeight: 900, color: '#e8eef5', lineHeight: 1 }}>
                        {product.ratings?.toFixed(1)}
                      </div>
                      <StarRating rating={product.ratings} />
                      <div style={{ fontSize: 12.5, color: '#6e7681', marginTop: 6 }}>
                        {product.numReviews} reviews
                      </div>
                    </div>
                    <div style={{ paddingTop: 6 }}>
                      {ratingDist.map(({ star, count }) => (
                        <RatingBar key={star} star={star} count={count} total={reviews.length} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Write review */}
                {user && (
                  <div style={{ marginBottom: 30, padding: 22, background: '#080b14', border: '1px solid #1e2530', borderRadius: 10 }}>
                    <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 18, color: '#e8eef5' }}>Write a Review</h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div style={{ marginBottom: 14 }}>
                        <label className="form-label">Your Rating</label>
                        <StarRating rating={newReview.rating} interactive onRate={r => setNewReview(p => ({ ...p, rating: r }))} />
                      </div>
                      <input type="text" placeholder="Review title (optional)" value={newReview.title}
                        onChange={e => setNewReview(p => ({ ...p, title: e.target.value }))}
                        style={{ width: '100%', background: '#0d1117', border: '1.5px solid #2d3748', borderRadius: 8, padding: '10px 14px', color: '#e8eef5', fontSize: 13.5, outline: 'none', marginBottom: 10, fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#2874f0'}
                        onBlur={e => e.target.style.borderColor = '#2d3748'} />
                      <textarea placeholder="Share your experience with this product..."
                        value={newReview.comment}
                        onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
                        required
                        style={{ width: '100%', background: '#0d1117', border: '1.5px solid #2d3748', borderRadius: 8, padding: '10px 14px', color: '#e8eef5', fontSize: 13.5, outline: 'none', height: 100, resize: 'vertical', marginBottom: 14, fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#2874f0'}
                        onBlur={e => e.target.style.borderColor = '#2d3748'} />
                      <button type="submit" disabled={submittingReview}
                        style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 26px', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: submittingReview ? 0.6 : 1 }}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Review list */}
                {reviews.length === 0 ? (
                  <p style={{ color: '#6e7681', fontSize: 14 }}>No reviews yet. Be the first to review this product!</p>
                ) : reviews.map(r => (
                  <div key={r._id} style={{ padding: '18px 0', borderBottom: '1px solid #1e2530' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2874f0, #8957e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0,
                      }}>
                        {r.user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: '#e8eef5' }}>{r.user?.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#2a7d2e', color: '#fff', padding: '1px 8px', borderRadius: 3, fontSize: 12, fontWeight: 800 }}>
                            {r.rating} ★
                          </div>
                          {r.isVerifiedPurchase && (
                            <span style={{ fontSize: 11.5, color: '#3fb950', fontWeight: 700 }}>✓ Verified Purchase</span>
                          )}
                          <span style={{ fontSize: 12, color: '#4d5562' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    {r.title && <p style={{ fontWeight: 700, fontSize: 14, color: '#e8eef5', marginBottom: 6 }}>{r.title}</p>}
                    <p style={{ color: '#8b9ab5', fontSize: 13.5, lineHeight: 1.75 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {recommendations.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '3px solid #2874f0' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e8eef5' }}>🔗 You May Also Like</h2>
              <Link to="/products" style={{ fontSize: 13, color: '#4da8ff', fontWeight: 700 }}>View all →</Link>
            </div>
            <div className="products-grid">
              {recommendations.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

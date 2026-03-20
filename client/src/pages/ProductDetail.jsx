import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ProductCard from '../components/ui/ProductCard'
import { PageLoader } from '../components/ui/Loaders'

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
  const [recommendations, setRecommendations] = useState([])
  const [liveValue, setLiveValue] = useState(0)

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

  // Mock Live Sensor Data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValue(prev => {
        const next = prev + (Math.random() - 0.5) * 5
        return parseFloat(Math.max(10, Math.min(100, next)).toFixed(2))
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <PageLoader />
  if (!product) return <div style={{ textAlign: 'center', padding: '100px 0' }}><h2>Product not found</h2></div>

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
  const wishlisted = isWishlisted(product._id)

  const isSensor = product.category?.slug === 'sensors' || product.category?.slug === 'iot-devices'

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: '20px 0 60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(450px, 40%) 1fr', gap: 40 }}>
        
        {/* Left: Images */}
        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {product.images?.map((img, i) => (
                <div key={i} onMouseEnter={() => setSelectedImage(i)}
                  style={{ width: 64, height: 64, border: `2px solid ${i === selectedImage ? '#2874f0' : '#eee'}`, borderRadius: 2, cursor: 'pointer', overflow: 'hidden', padding: 4 }}>
                  <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 4, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              <img src={product.images?.[selectedImage]?.url} style={{ width: '100%', maxHeight: 450, objectFit: 'contain' }} alt={product.name} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <button onClick={() => addToCart(product._id, quantity)}
              style={{ height: 56, background: '#ff9f00', color: '#fff', border: 'none', borderRadius: 2, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              🛒 ADD TO CART
            </button>
            <button onClick={() => { addToCart(product._id, quantity); window.location.href='/checkout' }}
              style={{ height: 56, background: '#fb641b', color: '#fff', border: 'none', borderRadius: 2, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              ⚡ BUY NOW
            </button>
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ paddingRight: 40 }}>
          <div style={{ fontSize: 14, color: '#878787', marginBottom: 8 }}>
            <Link to="/" style={{ color: '#2874f0', textDecoration: 'none' }}>Home</Link> / 
            <Link to="/products" style={{ color: '#2874f0', textDecoration: 'none' }}> Products</Link> / {product.name}
          </div>
          
          <h1 style={{ fontSize: 22, color: '#212121', fontWeight: 500, marginBottom: 8 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
             <div style={{ background: '#388e3c', color: '#fff', borderRadius: 2, padding: '2px 8px', fontSize: 14, fontWeight: 600 }}>
                {product.ratings.toFixed(1)} ★
             </div>
             <span style={{ color: '#878787', fontWeight: 500 }}>{product.numReviews} Ratings & Reviews</span>
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" style={{ height: 20 }} alt="assured" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: '#212121' }}>₹{finalPrice.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 16, color: '#878787', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#388e3c' }}>{discount}% off</span>
              </>
            )}
          </div>

          <p style={{ fontSize: 14, color: '#212121', lineHeight: 1.6, marginTop: 20, whiteSpace: 'pre-line' }}>{product.description}</p>

          {/* SENSOR LIVE DEMO (MAGIC FEATURE) */}
          {isSensor && (
            <div style={{ marginTop: 30, background: '#f1f3f6', borderRadius: 8, padding: 20, border: '1px dashed #2874f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <h3 style={{ margin: 0, fontSize: 16, color: '#212121' }}>🛠️ ELECTROMART LIVE LAB</h3>
                <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 700 }}>● ONLINE / CONNECTED</span>
              </div>
              <div style={{ background: '#fff', borderRadius: 4, padding: 20, textAlign: 'center', border: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#878787', textTransform: 'uppercase', letterSpacing: 1 }}>Current Signal Value</div>
                <div style={{ fontSize: 42, fontWeight: 700, color: '#2874f0', margin: '10px 0' }}>{liveValue} <span style={{ fontSize: 18 }}>μV</span></div>
                <div style={{ height: 40, overflow: 'hidden', opacity: 0.3 }}>
                   <svg width="100%" height="40" preserveAspectRatio="none">
                      <polyline points="0,20 20,10 40,25 60,5 80,30 100,15 120,20 140,0 160,40" fill="none" stroke="#2874f0" strokeWidth="2" />
                   </svg>
                </div>
              </div>
            </div>
          )}

          {/* Brand/Specs */}
          <div style={{ marginTop: 40 }}>
             <h3 style={{ fontSize: 18, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>Specifications</h3>
             <table style={{ width: '100%', marginTop: 10 }}>
                <tbody>
                   <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px 0', color: '#878787', width: '30%' }}>Brand</td>
                      <td style={{ padding: '12px 0' }}>{product.brand}</td>
                   </tr>
                   <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px 0', color: '#878787' }}>Model Name</td>
                      <td style={{ padding: '12px 0' }}>{product.name}</td>
                   </tr>
                   <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px 0', color: '#878787' }}>Connectivity</td>
                      <td style={{ padding: '12px 0' }}>{product.protocol || 'Standard GPIO'}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="container" style={{ marginTop: 60 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: 15, marginBottom: 20 }}>Similar Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {recommendations.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

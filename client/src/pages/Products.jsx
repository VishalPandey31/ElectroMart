import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'
import { SkeletonCard } from '../components/ui/Loaders'

const PRICE_RANGES = [
  { label: 'Under ₹199', min: 0, max: 199 },
  { label: '₹200 – ₹499', min: 200, max: 499 },
  { label: '₹500 – ₹999', min: 500, max: 999 },
  { label: '₹1,000 – ₹2,999', min: 1000, max: 2999 },
  { label: 'Above ₹3,000', min: 3000, max: 999999 },
]

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Rating', value: 'rating' },
]

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#212121', padding: '2px 0' }}>
        {title}
        <span style={{ fontSize: 11, color: '#888', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  )
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [view, setView] = useState('grid')
  const limit = 20

  const keyword = params.get('keyword') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const inStock = params.get('inStock') === 'true'
  const featured = params.get('featured') === 'true'
  const [ratings, setRatings] = useState([])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next); setPage(1)
  }

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (keyword) q.set('keyword', keyword)
      if (category) q.set('category', category)
      if (sort) q.set('sort', sort)
      if (minPrice) q.set('minPrice', minPrice)
      if (maxPrice) q.set('maxPrice', maxPrice)
      if (inStock) q.set('inStock', 'true')
      if (featured) q.set('featured', 'true')
      if (ratings.length) q.set('rating', Math.min(...ratings))
      q.set('page', page); q.set('limit', limit)
      const { data } = await api.get(`/products?${q}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch { setProducts([]) } finally { setLoading(false) }
  }, [keyword, category, sort, minPrice, maxPrice, inStock, featured, ratings, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const totalPages = Math.ceil(total / limit)

  const clearFilters = () => {
    setParams({}); setPage(1); setRatings([])
  }

  const activeFilters = [
    keyword && { label: `"${keyword}"`, clear: () => updateParam('keyword', '') },
    category && { label: category, clear: () => updateParam('category', '') },
    (minPrice || maxPrice) && { label: `₹${minPrice || 0} – ₹${maxPrice || '∞'}`, clear: () => { updateParam('minPrice', ''); updateParam('maxPrice', '') } },
    inStock && { label: 'In Stock', clear: () => updateParam('inStock', '') },
    featured && { label: 'Featured', clear: () => updateParam('featured', '') },
  ].filter(Boolean)

  return (
    <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      {/* ── Breadcrumb bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span className="sep">›</span>
            <span>Shop</span>
            {category && <><span className="sep">›</span><span style={{ color: '#212121', textTransform: 'capitalize' }}>{category}</span></>}
            {keyword && <><span className="sep">›</span><span style={{ color: '#212121' }}>"{keyword}"</span></>}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 10, alignItems: 'start' }}>

          {/* ── Sidebar ── */}
          <aside style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'sticky', top: 110 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#212121' }}>Filters</span>
              {activeFilters.length > 0 && (
                <button onClick={clearFilters} style={{ fontSize: 12, color: '#2874f0', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
              )}
            </div>
            <div style={{ padding: '0 16px' }}>
              {/* Category filter */}
              <FilterSection title="CATEGORY">
                {['arduino', 'esp32-esp8266', 'sensors', 'modules', 'robotics-kits', 'components', 'raspberry-pi', 'tools'].map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                    <input type="radio" name="category" checked={category === cat} onChange={() => updateParam('category', category === cat ? '' : cat)}
                      style={{ accentColor: '#2874f0', width: 14, height: 14 }} />
                    <span style={{ fontSize: 13, color: '#333', textTransform: 'capitalize' }}>{cat.replace(/-/g, ' / ')}</span>
                  </label>
                ))}
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="PRICE RANGE">
                {PRICE_RANGES.map(r => (
                  <label key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                    <input type="radio" name="price" checked={minPrice === String(r.min) && maxPrice === String(r.max)} onChange={() => { updateParam('minPrice', r.min); updateParam('maxPrice', r.max) }}
                      style={{ accentColor: '#2874f0', width: 14, height: 14 }} />
                    <span style={{ fontSize: 13, color: '#333' }}>{r.label}</span>
                  </label>
                ))}
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => updateParam('minPrice', e.target.value)}
                    style={{ width: '50%', border: '1px solid #ccc', borderRadius: 3, padding: '5px 8px', fontSize: 12, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#2874f0'} onBlur={e => e.target.style.borderColor = '#ccc'} />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)}
                    style={{ width: '50%', border: '1px solid #ccc', borderRadius: 3, padding: '5px 8px', fontSize: 12, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#2874f0'} onBlur={e => e.target.style.borderColor = '#ccc'} />
                </div>
              </FilterSection>

              {/* Customer Ratings */}
              <FilterSection title="CUSTOMER RATINGS">
                {[4, 3, 2].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                    <input type="checkbox" checked={ratings.includes(r)} onChange={() => setRatings(old => old.includes(r) ? old.filter(x => x !== r) : [...old, r])}
                      style={{ accentColor: '#2874f0', width: 14, height: 14 }} />
                    <span style={{ fontSize: 13, color: '#333', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#f9a825' }}>{'★'.repeat(r)}</span>{r}★ & above
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Others */}
              <FilterSection title="AVAILABILITY">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                  <input type="checkbox" checked={inStock} onChange={e => updateParam('inStock', e.target.checked ? 'true' : '')}
                    style={{ accentColor: '#2874f0', width: 14, height: 14 }} />
                  <span style={{ fontSize: 13, color: '#333' }}>In Stock Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={featured} onChange={e => updateParam('featured', e.target.checked ? 'true' : '')}
                    style={{ accentColor: '#2874f0', width: 14, height: 14 }} />
                  <span style={{ fontSize: 13, color: '#333' }}>Featured Items</span>
                </label>
              </FilterSection>
            </div>
          </aside>

          {/* ── Products Area ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Sort bar */}
            <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
                  {activeFilters.map((f, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#e8effc', border: '1px solid #b3c9f5', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#2874f0', fontWeight: 600 }}>
                      {f.label}
                      <button onClick={f.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2874f0', fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
                    </span>
                  ))}
                </div>
              )}
              {/* Right side: showing + sort + view */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: '#888' }}>
                  <span style={{ fontWeight: 700, color: '#212121' }}>{total.toLocaleString()}</span> results
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: '#888', fontWeight: 600 }}>SORT BY</span>
                  <select value={sort} onChange={e => updateParam('sort', e.target.value)}
                    style={{ border: '1px solid #e0e0e0', borderRadius: 3, padding: '6px 12px', fontSize: 13, color: '#2874f0', fontWeight: 700, background: '#fff', cursor: 'pointer', outline: 'none' }}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {/* Grid/List toggle */}
                <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                  {[['grid', '⊞'], ['list', '≡']].map(([v, ico]) => (
                    <button key={v} onClick={() => setView(v)}
                      style={{ padding: '5px 10px', background: view === v ? '#2874f0' : '#fff', color: view === v ? '#fff' : '#888', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                      {ico}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(185px, 1fr))',
              gap: 1, background: '#e0e0e0',
            }}>
              {loading
                ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                : products.length === 0
                  ? (
                    <div style={{ background: '#fff', gridColumn: '1/-1', padding: '60px 24px', textAlign: 'center' }}>
                      <p style={{ fontSize: 52, marginBottom: 14 }}>🔍</p>
                      <h3 style={{ fontWeight: 800, color: '#212121', marginBottom: 8 }}>No products found</h3>
                      <p style={{ color: '#888', marginBottom: 20 }}>Try different filters or keywords</p>
                      <button onClick={clearFilters} style={{ background: '#2874f0', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Clear All Filters</button>
                    </div>
                  )
                  : products.map(p => <ProductCard key={p._id} product={p} />)
              }
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding: '7px 14px', border: '1px solid #e0e0e0', borderRadius: 3, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#2874f0', fontWeight: 700, fontSize: 13 }}>
                  ← Prev
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let p = i + 1; if (totalPages > 7 && page > 4) p = page - 3 + i
                  return p <= totalPages ? (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: 36, height: 36, border: p === page ? 'none' : '1px solid #e0e0e0', borderRadius: 3, background: p === page ? '#2874f0' : '#fff', color: p === page ? '#fff' : '#333', fontWeight: p === page ? 800 : 500, cursor: 'pointer', fontSize: 13 }}>
                      {p}
                    </button>
                  ) : null
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ padding: '7px 14px', border: '1px solid #e0e0e0', borderRadius: 3, background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#2874f0', fontWeight: 700, fontSize: 13 }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

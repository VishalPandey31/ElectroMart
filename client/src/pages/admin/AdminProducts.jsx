import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PageLoader } from '../../components/ui/Loaders'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', description: '', category: '', brand: '', price: '', discountPrice: '', stock: '', images: [{ url: '' }], featured: false, specifications: [] })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/products?limit=50${search ? '&keyword=' + search : ''}`)
      setProducts(data.products || [])
    } finally { setLoading(false) }
  }

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || []))
    fetchProducts()
  }, [])

  useEffect(() => { const t = setTimeout(fetchProducts, 400); return () => clearTimeout(t) }, [search])

  const openAdd = () => { setEditProduct(null); setForm({ name: '', description: '', category: categories[0]?._id || '', brand: '', price: '', discountPrice: '', stock: '', images: [{ url: '' }], featured: false, specifications: [] }); setShowModal(true) }
  const openEdit = (p) => { setEditProduct(p); setForm({ name: p.name, description: p.description, category: p.category?._id || '', brand: p.brand || '', price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, images: p.images?.length ? p.images : [{ url: '' }], featured: p.featured, specifications: p.specifications || [] }); setShowModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, stock: Number(form.stock) }
    try {
      if (editProduct) {
        const { data } = await api.put(`/products/${editProduct._id}`, payload)
        setProducts(prev => prev.map(p => p._id === editProduct._id ? data.product : p))
        toast.success('Product updated!')
      } else {
        const { data } = await api.post('/products', payload)
        setProducts(prev => [data.product, ...prev])
        toast.success('Product created!')
      }
      setShowModal(false)
    } catch (err) { toast.error(err.message) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try { await api.delete(`/products/${id}`); setProducts(prev => prev.filter(p => p._id !== id)); toast.success('Deleted') }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>📦 Products</h1>
        <button onClick={openAdd} className="btn-primary" style={{ padding: '9px 20px' }}>+ Add Product</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" style={{ maxWidth: 320 }} />
      </div>

      {loading ? <PageLoader /> : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.02)' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 600, maxWidth: 200 }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    {p.featured && <span style={{ fontSize: 10, color: 'var(--accent-light)' }}>⭐ Featured</span>}
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{p.category?.name}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <p style={{ fontWeight: 700 }}>₹{(p.discountPrice || p.price)?.toLocaleString()}</p>
                    {p.discountPrice > 0 && <p style={{ fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString()}</p>}
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock < 10 ? 'badge-warning' : 'badge-success'}`}>{p.stock}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>⭐ {p.ratings?.toFixed(1)} ({p.numReviews})</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(p._id)} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', padding: 32 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: 18 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Category *</label>
                  <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="form-input" required>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Brand</label>
                  <input value={form.brand} onChange={(e) => setForm(p => ({ ...p, brand: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} className="form-input" required min={0} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Discount Price (₹)</label>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm(p => ({ ...p, discountPrice: e.target.value }))} className="form-input" min={0} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm(p => ({ ...p, stock: e.target.value }))} className="form-input" required min={0} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Image URL</label>
                  <input value={form.images?.[0]?.url || ''} onChange={(e) => setForm(p => ({ ...p, images: [{ url: e.target.value }] }))} className="form-input" placeholder="https://..." />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" required style={{ height: 80, resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
                    Featured product
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>{editProduct ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '10px 24px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

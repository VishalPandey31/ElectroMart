import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', icon: '📦', description: '', parent: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || []))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/categories', form)
      setCategories(prev => [...prev, data.category])
      toast.success('Category created!')
      setForm({ name: '', icon: '📦', description: '', parent: '' })
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try { await api.delete(`/categories/${id}`); setCategories(prev => prev.filter(c => c._id !== id)); toast.success('Deleted') }
    catch (err) { toast.error(err.message) }
  }

  const parents = categories.filter(c => !c.parent)

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🗂️ Categories</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Add New Category</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 0 }}>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Icon</label>
                <input value={form.icon} onChange={(e) => setForm(p => ({ ...p, icon: e.target.value }))} className="form-input" style={{ width: 60, textAlign: 'center', fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Name *</label>
                <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Parent Category (optional)</label>
              <select value={form.parent} onChange={(e) => setForm(p => ({ ...p, parent: e.target.value }))} className="form-input">
                <option value="">None (Top Level)</option>
                {parents.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" style={{ height: 60, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '9px 20px' }}>
              {loading ? 'Adding...' : '+ Add Category'}
            </button>
          </form>
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>All Categories ({categories.length})</h3>
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            {parents.map(cat => (
              <div key={cat._id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{cat.icon} {cat.name}</span>
                  <button onClick={() => handleDelete(cat._id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>🗑️ Delete</button>
                </div>
                {categories.filter(c => c.parent?._id === cat._id || c.parent === cat._id).map(child => (
                  <div key={child._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 6px 28px', borderRadius: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{child.icon} {child.name}</span>
                    <button onClick={() => handleDelete(child._id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCategories

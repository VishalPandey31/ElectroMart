import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const Addresses = () => {
  const { user, updateUser } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false })

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/address', form)
      updateUser({ ...user, addresses: data.addresses })
      toast.success('Address added!')
      setShowForm(false)
      setForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false })
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/auth/address/${id}`)
      updateUser({ ...user, addresses: data.addresses })
      toast.success('Address removed')
    } catch { toast.error('Error deleting address') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>📍 My Addresses</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>+ Add Address</button>
      </div>
      {showForm && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 20, border: '1px solid var(--accent)' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>New Address</h4>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['fullName', 'Full Name *'], ['phone', 'Phone *'], ['addressLine1', 'Address Line 1 *'], ['addressLine2', 'Address Line 2'], ['city', 'City *'], ['state', 'State *'], ['pincode', 'Pincode *']].map(([key, label]) => (
                <div key={key} style={{ gridColumn: ['addressLine1', 'addressLine2'].includes(key) ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type="text" value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} className="form-input" required={!['addressLine2'].includes(key)} />
                </div>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 14, fontSize: 14 }}>
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm(p => ({ ...p, isDefault: e.target.checked }))} style={{ accentColor: 'var(--accent)' }} />
              Set as default address
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '9px 20px' }}>{loading ? 'Adding...' : 'Add Address'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '9px 20px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {user?.addresses?.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No addresses saved. Add your first delivery address.</p>
      ) : user?.addresses?.map((addr) => (
        <div key={addr._id} className="glass-card" style={{ padding: 18, marginBottom: 12, border: addr.isDefault ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{addr.fullName}</p>
              <p>{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
              <p>{addr.city}, {addr.state} – {addr.pincode}</p>
              <p>📞 {addr.phone}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
              {addr.isDefault && <span className="badge badge-info">Default</span>}
              <button onClick={() => handleDelete(addr._id)} style={{ fontSize: 12, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Addresses

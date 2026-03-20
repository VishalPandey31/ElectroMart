import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PageLoader } from '../../components/ui/Loaders'

const AdminVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/vendors').then(({ data }) => setVendors(data.vendors || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/vendors/${id}`, { status })
      setVendors(prev => prev.map(v => v._id === id ? data.vendor : v))
      toast.success(`Vendor ${status}`)
    } catch (err) { toast.error(err.message) }
  }

  const STATUS_COLOR = { pending: 'warning', approved: 'success', rejected: 'danger', suspended: 'danger' }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🏪 Vendors</h1>
      {loading ? <PageLoader /> : vendors.length === 0 ? (
        <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🏪</p>
          <p style={{ color: 'var(--text-secondary)' }}>No vendor applications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {vendors.map((v) => (
            <div key={v._id} className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: 16 }}>{v.storeName}</p>
                  <span className={`badge badge-${STATUS_COLOR[v.status] || 'info'}`} style={{ textTransform: 'capitalize' }}>{v.status}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Owner: {v.user?.name} · {v.user?.email}</p>
                {v.contactPhone && <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📞 {v.contactPhone}</p>}
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Commission: {v.commissionRate}% · Total Sales: ₹{v.totalRevenue?.toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {v.status !== 'approved' && (
                  <button onClick={() => updateStatus(v._id, 'approved')} className="btn-primary" style={{ padding: '7px 14px', fontSize: 13, background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>✓ Approve</button>
                )}
                {v.status !== 'rejected' && (
                  <button onClick={() => updateStatus(v._id, 'rejected')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13, color: 'var(--danger)', borderColor: 'var(--danger)' }}>✗ Reject</button>
                )}
                {v.status === 'approved' && (
                  <button onClick={() => updateStatus(v._id, 'suspended')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }}>⏸ Suspend</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVendors

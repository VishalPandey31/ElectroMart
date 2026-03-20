import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PageLoader } from '../../components/ui/Loaders'

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded']
const STATUS_COLOR = { pending:'warning', confirmed:'info', processing:'info', shipped:'info', delivered:'success', cancelled:'danger', refunded:'danger' }

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/orders?${filter ? 'status=' + filter + '&' : ''}page=${page}&limit=20`)
      setOrders(data.orders || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filter, page])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data.order : o))
      toast.success(`Status updated to "${status}"`)
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🛒 Orders</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('')} className={filter === '' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 14px', fontSize: 12 }}>All</button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={filter === s ? 'btn-primary' : 'btn-secondary'} style={{ padding: '7px 14px', fontSize: 12, textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      {loading ? <PageLoader /> : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--border)', background: i%2===0?'transparent':'rgba(99,102,241,0.02)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{o.orderNumber}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                    <p>{o.user?.name}</p>
                    <p style={{ fontSize: 11 }}>{o.user?.email}</p>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{o.orderItems?.length} items</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>₹{o.totalPrice?.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge ${o.isPaid ? 'badge-success' : 'badge-warning'}`}>{o.isPaid ? 'Paid' : o.paymentMethod === 'cod' ? 'COD' : 'Pending'}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge badge-${STATUS_COLOR[o.status]||'info'}`} style={{ textTransform: 'capitalize' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="form-input" style={{ padding: '5px 8px', fontSize: 12, width: 110 }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders

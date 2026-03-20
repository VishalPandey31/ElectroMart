import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PageLoader } from '../../components/ui/Loaders'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/users${search ? '?search=' + search : ''}`)
      setUsers(data.users || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { const t = setTimeout(fetchUsers, 400); return () => clearTimeout(t) }, [search])

  const updateRole = async (id, role, isActive) => {
    try {
      const { data } = await api.put(`/admin/users/${id}`, { role, isActive })
      setUsers(prev => prev.map(u => u._id === id ? data.user : u))
      toast.success('User updated')
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>👥 Users</h1>
      <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" style={{ maxWidth: 320, marginBottom: 20 }} />
      {loading ? <PageLoader /> : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Avatar', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', background: i%2===0?'transparent':'rgba(99,102,241,0.02)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                      {u.name?.charAt(0)}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value, u.isActive)} className="form-input" style={{ padding: '4px 8px', fontSize: 12, width: 90 }}>
                      {['user', 'vendor', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => updateRole(u._id, u.role, !u.isActive)}
                      className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}>
                      {u.isActive ? '✓ Active' : '✗ Blocked'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'vendor' ? 'info' : 'success'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span>
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

export default AdminUsers

import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { PageLoader } from '../../components/ui/Loaders'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PIE_COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#3b82f6']

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card" style={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{icon}</div>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 3 }}>{label}</p>
        <p style={{ fontWeight: 800, fontSize: 24 }}>{value}</p>
      </div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const chartData = stats?.monthlyRevenue?.map(m => ({ name: MONTHS[m._id.month - 1], revenue: Math.round(m.revenue), orders: m.orders })) || []
  const statusData = stats?.ordersByStatus?.map(s => ({ name: s._id, value: s.count })) || []

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>📊 Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Welcome back! Here's what's happening in your store.</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 28 }}>
        <StatCard icon="💰" label="Total Revenue" value={`₹${(stats?.stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color="#22c55e" />
        <StatCard icon="📦" label="Total Orders" value={stats?.stats?.totalOrders || 0} color="#6366f1" />
        <StatCard icon="👥" label="Total Users" value={stats?.stats?.totalUsers || 0} color="#3b82f6" />
        <StatCard icon="🛒" label="Products" value={stats?.stats?.totalProducts || 0} color="#f59e0b" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Revenue & Orders (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6,6,0,0]} name="Revenue (₹)" />
              <Bar dataKey="orders" fill="#22c55e" radius={[6,6,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Order Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {statusData.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🕐 Recent Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Order #', 'Customer', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((o) => (
                <tr key={o._id}>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{o.orderNumber}</td>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>{o.user?.name}</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>₹{o.totalPrice?.toLocaleString()}</td>
                  <td style={{ padding: '8px 0' }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: 'var(--accent-light)', textTransform: 'capitalize' }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>⭐ Top Products</h3>
          {stats?.topProducts?.map((p, i) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-secondary)', width: 20 }}>#{i + 1}</span>
              <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.soldCount} sold · ₹{p.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

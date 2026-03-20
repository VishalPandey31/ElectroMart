import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/products', icon: '📦', label: 'Products' },
  { to: '/admin/orders', icon: '🛒', label: 'Orders' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/categories', icon: '🗂️', label: 'Categories' },
  { to: '/admin/vendors', icon: '🏪', label: 'Vendors' },
]

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#818cf8,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ElectroMart</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Admin Panel</p>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={{ marginBottom: 4 }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: 10 }}>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Administrator</p>
          </div>
          <button onClick={() => { logout(); navigate('/') }} className="btn-secondary" style={{ width: '100%', padding: '9px', fontSize: 13 }}>🚪 Logout</button>
        </div>
      </aside>
      {/* Content */}
      <main style={{ padding: 32, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
